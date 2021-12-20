import { Profile } from "./profile";
import { Attribute } from "../attribute/attribute";
import { Feature } from "../feature/feature";
import { CharacterSettings } from "./character-settings";
import { Item } from "../base/item";
import { Skill } from "../skill/skill";
import { Advantage, AdvantageContainerType } from "../advantage/advantage";
import { Equipment } from "../equipment/equipment";
import { Spell } from "../spell/spell";
import { MeleeWeapon } from "../weapon/melee-weapon";
import { RangedWeapon } from "../weapon/ranged-weapon";
import { Note } from "../note/note";
import { Subject } from "rxjs";
import { has, get, set } from "prop";
import { AttributeType } from "../attribute/attribute-def";
import { Encumbrance } from "../encumbrance";
import { Technique } from "../technique/technique";
import { SkillDefault, SkillDefaultType } from "../skill/skill-default";
import { DamageProgressions } from "../damage-progression";
import { v4 } from "uuid";
export type CharacterItems =
  | Skill
  | Technique
  | Advantage
  | Equipment
  | Spell
  | Note;
export type ConstructorsOf<U> = U extends any
  ? new (...args: any[]) => U
  : never;
export type CharacterClasses = ConstructorsOf<CharacterItems>;
interface CharacterCache {
  weightCarried: number;
  weightCarriedForSkills: number;
  wealthCarried: number;
  wealthNotCarried: number;
  attributePoints: number;
  advantagePoints: number;
  disadvantagePoints: number;
  quirkPoints: number;
  skillPoints: number;
  spellPoints: number;
  racePoints: number;
}
const cleanCache: CharacterCache = {
  weightCarried: 0,
  weightCarriedForSkills: 0,
  wealthCarried: 0,
  wealthNotCarried: 0,
  attributePoints: 0,
  advantagePoints: 0,
  disadvantagePoints: 0,
  quirkPoints: 0,
  skillPoints: 0,
  spellPoints: 0,
  racePoints: 0,
};
export class Character extends Item {
  private variableResolverExclusions: Set<string> = new Set();
  private _modifiedOn = new Date();
  private _createdOn = new Date();
  private featureMap: Map<string, Feature[]> = new Map();
  thirdPartyData: Partial<Record<string, any>> = {};
  attributes: Map<string, Attribute> = new Map();
  liftingStrengthBonus?: number;
  strikingStrengthBonus?: number;
  dodgeBonus?: number;
  parryBonus?: number;
  blockBonus?: number;
  totalPoints?: number;
  settings = new CharacterSettings(this);
  profile = new Profile();
  private cache = { ...cleanCache };
  private skillsUpdated = false;
  private spellsUpdated = false;
  private collection = new Map<string, CharacterItems>();
  addItemNotifier = new Subject<CharacterItems>();
  removeItemNotifier = new Subject<string[]>();
  editItemNotifier = new Subject<string>();
  constructor() {
    super();
  }
  private dateToString(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    const meridian = hours < 12 ? "AM" : "PM";
    if (hours > 12) hours -= 12;
    if (+minutes < 10) minutes = "0" + minutes;
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} at ${hours}:${minutes} ${meridian}`;
  }
  get modifiedOn() {
    return this.dateToString(this._modifiedOn);
  }
  get createdOn() {
    return this.dateToString(this._createdOn);
  }
  // get name() {
  //   return this.profile.name;
  // }
  // set name(name: string) {
  //   console.log(this);
  //   this.profile.name = name;
  // }
  private matchItems<T extends CharacterItems>(
    types: string[],
    match?: object
  ): T[] {
    return [...this.collection.values()]
      .filter((item): item is T => types.includes(item.getType()))
      .filter((item) => {
        if (typeof match === "object") {
          return Object.entries(match).every(([key, value]) => {
            if (key in item) {
              return item[key as keyof T] === value;
            } else {
              return false;
            }
          });
        } else {
          return true;
        }
      });
  }
  getSkills(): Skill[] {
    return this.matchItems<Skill>(["skill"]).map((skill) =>
      skill.withCharacter(this)
    );
  }
  getTechniques(): Technique[] {
    return this.matchItems<Technique>(["technique"]).map((technique) =>
      technique.withCharacter(this)
    );
  }
  getSkillsAndTechniques(): (Technique | Skill)[] {
    return this.matchItems<Skill | Technique>(["skill", "technique"]).map(
      (skilllike) => skilllike.withCharacter(this)
    );
  }
  getSpells(): Spell[] {
    return this.matchItems(["spell"]);
  }
  getAdvantages(): Advantage[] {
    return this.matchItems(["advantage"]);
  }
  getEquipment(): Equipment[] {
    return this.matchItems(["equipment"]);
  }
  getCarriedEquipment(): Equipment[] {
    return this.matchItems(["equipment"], { location: "carried" });
  }
  getOtherEquipment(): Equipment[] {
    return this.matchItems(["equipment"], { location: "other" });
  }
  getNotes(): Note[] {
    return this.matchItems(["note"]);
  }
  getAllItems() {
    return [...this.collection.values()];
  }
  getItem(id: string) {
    return this.collection.get(id);
  }
  hasItem(id: string) {
    return this.getItem(id) !== undefined;
  }
  editItem(id: string, property: string, value: any) {
    const item = this.getItem(id);
    if (item && has(item, property)) {
      const changed = set(item, property, value);
      this.editItemNotifier.next(id);
    }
  }
  deleteItems(ids: string[]) {
    let changed = false;
    let removedIds: string[] = [];
    for (const id of ids) {
      const removed = this.collection.delete(id);
      if (removed) removedIds.push(id);
    }
    this.removeItemNotifier.next(removedIds);
  }
  edit(property: string, value: any) {
    const changed = set(this, property, value);
    if (changed) {
      this.editNotifier.next(null);
    }
  }
  addItem(constructor: new () => CharacterItems, merge?: object) {
    const item = new constructor();
    Object.assign(item, merge);
    this.collection.set(item.id, item);
    this.addItemNotifier.next(item);
  }
  addManyItems(items: CharacterItems[]) {
    for (const item of items) {
      this.collection.set(item.id, item);
    }
  }
  addSkill() {
    this.addItem(Skill);
  }
  addTechnique() {
    this.addItem(Technique);
  }
  addSpell() {
    this.addItem(Spell);
  }
  addAdvantage() {
    this.addItem(Advantage);
  }
  addEquipment(location = "carried") {
    this.addItem(Equipment, { location });
  }
  addCarriedEquipment() {
    this.addEquipment();
  }
  addOtherEquipment() {
    this.addEquipment("other");
  }
  addNote() {
    this.addItem(Note);
  }
  getAllWeapons() {
    return this.getAllItems().flatMap((item) => {
      if ("weapons" in item) {
        return item.weapons;
      } else {
        return [];
      }
    });
  }
  getMeleeWeapons(): MeleeWeapon[] {
    return this.getAllWeapons().filter(
      (weapon): weapon is MeleeWeapon => weapon instanceof MeleeWeapon
    );
  }
  getRangedWeapons(): RangedWeapon[] {
    return this.getAllWeapons().filter(
      (weapon): weapon is RangedWeapon => weapon instanceof RangedWeapon
    );
  }
  private characterInitialize() {}
  recalculate() {}
  private _calculateAll() {
    this.calculateAdvantagePoints();
    this.calculateAttributePoints();
    this.calculateSkillPoints();
    this.calculateSpellPoints();
    this.calculateWeightAndWealthCarried();
    this.calculateWealthNotCarried();
  }
  protected _loadSelf() {}
  protected _saveSelf() {}
  updateSkills() {}
  updateSpells() {}
  getAttributeCurrentValue(name: string): number | undefined {
    return this.attributes.get(name)?.getCurrentValue(this);
  }
  getAttributeCost(name: string): number {
    return 0;
  }
  get primaryAttributes(): Attribute[] {
    return [...this.attributes.values()].filter((attribute) => {
      const def = attribute.getDef(this);
      if (def) {
        return (
          def.type !== AttributeType.Pool && !def.attributeBase?.startsWith("$")
        );
      }
    });
  }
  get secondaryAttributes(): Attribute[] {
    return [...this.attributes.values()].filter((attribute) => {
      const def = attribute.getDef(this);
      if (def) {
        return (
          def.type !== AttributeType.Pool && def.attributeBase?.startsWith("$")
        );
      }
    });
  }
  get pools(): Attribute[] {
    return [...this.attributes.values()].filter((attribute) => {
      const def = attribute.getDef(this);
      if (def) {
        return def.type === AttributeType.Pool;
      }
    });
  }
  get effectiveStrikingStrength() {
    return this.getAttributeCurrentValue("st") || 10;
  }
  getThrust(strength = this.effectiveStrikingStrength) {
    return DamageProgressions.BasicSet.calculateThrust(strength);
  }
  getSwing(strength = this.effectiveStrikingStrength) {
    return DamageProgressions.BasicSet.calculateSwing(strength);
  }
  getBasicLift(desiredUnits?: string): number {
    const st = this.getAttributeCurrentValue("st") || 10;
    const bl = (st * st) / 5;
    return Math.floor(bl);
  }
  getMultipleOfBasicLift(multiple: number) {
    return this.getBasicLift() * multiple;
  }
  get oneHandedLift() {
    return this.getMultipleOfBasicLift(2);
  }
  get twoHandedLift() {
    return this.getMultipleOfBasicLift(8);
  }
  get shoveAndKnockOver() {
    return this.getMultipleOfBasicLift(12);
  }
  get runningShoveAndKnockOver() {
    return this.getMultipleOfBasicLift(24);
  }
  get carryOnBack() {
    return this.getMultipleOfBasicLift(15);
  }
  get shiftSlightly() {
    return this.getMultipleOfBasicLift(50);
  }
  getMaximumCarry(encumbrance: Encumbrance): number {
    return this.getBasicLift() * encumbrance;
  }
  getMove(encumbrance = this.getEncumbranceLevel()): number {
    const move = this.getAttributeCurrentValue("move") || 5;
    return move - encumbrance;
  }
  getDodge(encumbrance = this.getEncumbranceLevel()): number {
    const dodge = this.getAttributeCurrentValue("dodge") || 8;
    return dodge - encumbrance;
  }
  getEncumbranceLevel(forSkills = false): number {
    const carriedWeight = this.getWeightCarried(forSkills);
    if (carriedWeight < this.getMaximumCarry(Encumbrance.None)) {
      return 0;
    } else if (carriedWeight < this.getMaximumCarry(Encumbrance.Light)) {
      return 1;
    } else if (carriedWeight < this.getMaximumCarry(Encumbrance.Medium)) {
      return 2;
    } else if (carriedWeight < this.getMaximumCarry(Encumbrance.Heavy)) {
      return 3;
    } else {
      return 4;
    }
  }
  isCarryingGreaterThanMaxLoad(forSkills = false): boolean {
    const carriedWeight = this.getWeightCarried(forSkills);
    return carriedWeight >= this.getMaximumCarry(Encumbrance.ExtraHeavy);
  }
  getWeightCarried(forSkills = false): number {
    const { weightCarriedForSkills, weightCarried } = this.cache;
    return forSkills ? weightCarriedForSkills : weightCarried;
  }
  get WealthCarried(): number {
    return this.cache.wealthCarried;
  }
  get WealthNotCarried(): number {
    return this.cache.wealthNotCarried;
  }
  convertFromGurpsMetric(value: number): number {
    return 0;
  }
  convertToGurpsMetric(value: number): number {
    return 0;
  }
  calculateWeightAndWealthCarried(notify = true) {
    let weightCarried = 0;
    let wealthCarried = 0;
    const carriedEquipment = this.getCarriedEquipment();
    carriedEquipment.forEach((equipment) => {
      if (equipment.equipped) {
        weightCarried += equipment.eWeight;
        wealthCarried += equipment.eValue;
      }
    });
    Object.assign(this.cache, {
      wealthCarried,
      weightCarried,
    });
  }
  calculateWealthNotCarried(notify = false) {
    let weightNotCarried = 0;
    let wealthNotCarried = 0;
    const otherEquipment = this.getOtherEquipment();
    otherEquipment.forEach((equipment) => {
      weightNotCarried += equipment.eWeight;
      wealthNotCarried += equipment.eValue;
    });
    Object.assign(this.cache, {
      wealthNotCarried,
      weightNotCarried,
    });
  }
  private _preserveMoveAndDodge(): number[] {
    return [];
  }

  get spentPoints(): number {
    let spentPoints = 0;
    spentPoints += this.attributePoints;
    spentPoints += this.advantagePoints;
    spentPoints -= this.disadvantagePoints;
    spentPoints -= this.quirkPoints;
    spentPoints += this.skillPoints;
    spentPoints += this.spellPoints;
    spentPoints += this.racePoints;
    return spentPoints;
  }
  get unspentPoints(): number {
    return (this.totalPoints || 0) - this.spentPoints;
  }
  set unspentPoints(unspent: number) {
    const current = this.unspentPoints;
    if (current != unspent) {
      this.totalPoints = unspent + this.spentPoints;
    }
    this.editNotifier.next(null);
  }
  get attributePoints(): number {
    return this.cache.attributePoints;
  }
  calculateAttributePoints(): number {
    let attributePoints = 0;
    for (const attribute of this.attributes.values()) {
      attributePoints += attribute.getPointCost(this);
    }
    return (this.cache.attributePoints = attributePoints);
  }
  get racePoints(): number {
    return this.cache.racePoints;
  }
  get advantagePoints(): number {
    return this.cache.advantagePoints;
  }
  get disadvantagePoints(): number {
    return this.cache.disadvantagePoints;
  }
  get quirkPoints(): number {
    return this.cache.quirkPoints;
  }
  calculateAdvantagePoints() {
    let advantagePoints = 0;
    let disadvantagePoints = 0;
    let racePoints = 0;
    let quirkPoints = 0;
    for (const advantage of this.getAdvantages()) {
      const cost = advantage.getAdjustedPoints();
      if (cost === -1) {
        quirkPoints -= cost;
      } else if (cost > 0) {
        advantagePoints += cost;
      } else if (cost < 0) {
        disadvantagePoints -= cost;
      }
    }
    Object.assign(this.cache, {
      advantagePoints,
      disadvantagePoints,
      racePoints,
      quirkPoints,
    });
  }
  get skillPoints() {
    return this.cache.skillPoints;
  }
  calculateSkillPoints(): number {
    let skillPoints = 0;
    for (const skill of [...this.getSkills(), ...this.getTechniques()]) {
      skillPoints += skill.points;
    }
    return (this.cache.skillPoints = skillPoints);
  }
  get spellPoints(): number {
    return this.cache.spellPoints;
  }
  calculateSpellPoints(): number {
    let spellPoints = 0;
    for (const spell of this.getSpells()) {
      spellPoints += spell.points;
    }
    return (this.cache.spellPoints = spellPoints);
  }
  getAdvantageNamed(name: string) {
    return this.getAdvantages().find((advantage) => advantage.name === name);
  }
  hasAdvantageNamed(name: string) {
    return !!this.getAdvantageNamed(name);
  }
  getSkillNamed(name: string) {
    return this.getSkills().find((advantage) => advantage.name === name);
  }
  getBestSkillName(name: string) {}
  processFeaturesAndPrereqs(): boolean {
    return true;
  }
  processFeatures(): boolean {
    return true;
  }
  private static _buildFeatureMap(
    map: Character["featureMap"],
    iterator: Iterable<Item>
  ): boolean {
    let needRepaint = false;
    for (const row of iterator) {
    }
    return needRepaint;
  }
  private static _processFeature(
    map: Character["featureMap"],
    levels: number,
    feature: Feature
  ): boolean {
    return false;
  }
  private _processPrerequisites(): boolean {
    return false;
  }
  setFeatureMap(map: Character["featureMap"]) {}
  getCostReductionFor(id: string): number {
    return 0;
  }
  getBonusFor(id: string, tooltip?: string): number {
    return 0;
  }
  getBestLevelFromDefaults(skillDefaults: SkillDefault[]): number {
    return skillDefaults.reduce((level, sd) => {
      switch (sd.type) {
        case SkillDefaultType.Skill: {
          return this.getSkills()
            .filter((skill) => sd.matchesSkill(skill))
            .reduce((level, skill) => {
              return Math.max(level, skill.calculateLevel(this) + sd.modifier);
            }, level);
        }
        case SkillDefaultType.Block: {
          return level;
        }
        case SkillDefaultType.Parry: {
          return level;
        }
        case SkillDefaultType.Ten: {
          return 10 + sd.modifier;
        }
        default: {
          const attributeLevel = this.getAttributeCurrentValue(sd.type);
          if (attributeLevel) {
            return attributeLevel + sd.modifier;
          } else {
            return level;
          }
        }
      }
    }, 0);
  }
  getWeaponComparedDamageBonusesFor(
    id: string,
    nameQualifier: string,
    specializationQualifier: string,
    categoriesQualifier: Set<string>,
    dieCount: number,
    tooltip: string
  ): number[] {
    return [];
  }
  getNamedWeaponDamageBonusesFor(
    id: string,
    nameQualifier: string,
    specializationQualifier: string,
    categoriesQualifier: Set<string>,
    dieCount: number,
    tooltip: string
  ): number[] {
    return [];
  }
  getNamedWeaponSkillBonusesFor(
    id: string,
    nameQualifier: string,
    specializationQualifier: string,
    categoriesQualifier: Set<string>,
    dieCount: number,
    tooltip: string
  ): number[] {
    return [];
  }
  getSkillComparedBonusFor(
    id: string,
    nameQualifier: string,
    specializationQualifier: string,
    categoriesQualifier: Set<string>,
    dieCount: number,
    tooltip?: string
  ): number[] {
    return [];
  }
  getSkillPointsComparedBonusFor(
    id: string,
    nameQualifier: string,
    specializationQualifier: string,
    categoriesQualifier: Set<string>,
    dieCount: number,
    tooltip?: string
  ): number[] {
    return [];
  }
  getSpellComparedBonusFor(
    id: string,
    qualifier: string,
    categories: string,
    tooltip?: string
  ): number {
    return 0;
  }
  getSpellPointComparedBonusFor(
    id: string,
    qualifier: string,
    categories: string,
    tooltip?: string
  ): number {
    return 0;
  }
  postUndoEdit(name: string, setter: unknown, before: Object, after: Object) {}
  isthresholdOpMet(): boolean {
    return false;
  }
  countThresholdOpMet(): number {
    return 0;
  }
  resolveVariable(variableName: string): string {
    return "";
  }
  getWebProfileSrc() {
    const dataImage = "data:image/";
    const b64 = dataImage + "png;base64,";
    const portrait = this.profile.portrait || "";
    const src =
      typeof portrait === "string"
        ? portrait.startsWith(dataImage)
          ? portrait
          : b64 + portrait
        : "";
    return src;
  }
  getType() {
    return "character" as const;
  }
  private static hasChildArray<T>(obj: T): obj is T & { children: T[] } {
    return (
      typeof obj === "object" &&
      "children" in obj &&
      //@ts-ignore
      obj.children instanceof Array
    );
  }
  private static flat<T>(arr: T[]): T[] {
    return arr.reduce((acc, cur, i, arr) => {
      if (Character.hasChildArray(cur)) {
        return [...acc, cur, ...Character.flat(cur.children)];
      } else {
        return [...acc, cur];
      }
    }, [] as T[]);
  }
  static getConstructor(type: string) {
    if (type.includes("skill")) {
      return Skill;
    } else if (type.includes("technique")) {
      return Technique;
    } else if (type.includes("spell")) {
      return Spell;
    } else if (type.includes("advantage")) {
      return Advantage;
    } else if (type.includes("equipment")) {
      return Equipment;
    } else if (type.includes("note")) {
      return Note;
    } else {
      throw new Error("Could not get constructor for type.");
    }
  }
  private loadData<T extends CharacterItems>(
    data: any,
    merge?: Record<string, any>
  ) {
    try {
      if (data instanceof Array) {
        const instances = data.map((data) => {
          const constructor = Character.getConstructor(data.type);
          return new constructor().loadGcs(data, merge);
        });
        this.addManyItems(instances);
      }
    } catch (err) {
      console.error(err);
    }
  }
  private clean() {
    this.attributes.clear();
    this.collection.clear();
    this.profile = new Profile();
    this.settings = new CharacterSettings(this);
    this.thirdPartyData = {};
    this.cache = { ...cleanCache };
  }
  saveGcs() {
    const attributes = [...this.attributes.values()].map((attribute) =>
      attribute.saveGcs()
    );
    const advantages = this.getAdvantages().map((advantage) =>
      advantage.saveGcs()
    );
    const skills = this.getSkills().map((skill) => skill.saveGcs());
    const equipment = this.getEquipment().map((equipment) =>
      equipment.saveGcs()
    );
    const other_equipment = this.getOtherEquipment().map((equipment) =>
      equipment.saveGcs()
    );
    return {
      ...super.saveGcs(),
      attributes,
      created_date: this.createdOn,
      modified_date: this.modifiedOn,
      profile: this.profile?.saveGcs(),
      third_party: {},
      total_points: this.totalPoints,
      settings: this.settings?.saveGcs(),
      advantages,
      skills,
      equipment,
      other_equipment,
    };
  }
  loadGcs(data: any): this {
    this.clean();
    try {
      super.loadGcs(data);
      let {
        attributes = [],
        created_date,
        modified_date,
        profile,
        third_party,
        total_points,
        settings,
        skills = [],
        advantages = [],
        spells = [],
        equipment = [],
        other_equipment = [],
        notes = [],
      } = data;
      skills = Character.flat(skills);
      advantages = Character.flat(advantages);
      spells = Character.flat(spells);
      equipment = Character.flat(equipment);
      other_equipment = Character.flat(other_equipment);
      notes = Character.flat(notes);
      this.profile?.loadGcs(profile);
      this.settings?.loadGcs(settings);
      this.settings.initAttributes(this, attributes);
      this.totalPoints = total_points;
      this.loadData(skills);
      this.loadData(advantages);
      this.loadData(spells);
      this.loadData(equipment);
      this.loadData(other_equipment, { location: "other" });
      this.loadData(notes);
      this._calculateAll();
    } catch (err) {
      console.error(err);
    }
    return this;
  }
  saveFoundry() {
    return {
      ...super.saveFoundry(),
      name: this.profile.name || "???",
      img: this.getWebProfileSrc(),
    };
  }
  loadFoundry(data: any) {
    try {
      super.loadFoundry(data);
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
