import { Item } from "../base/item";
import { WeaponStats } from "../weapon/weapon-stats";
export enum AdvantageType {
  Mental,
  Physical,
  Social,
  Exotic,
  Supernatural,
}
export enum SelfControlRoll {
  Never = "",
  Rarely = "6",
  FairlyOften = "9",
  QuiteOften = "12",
  AlmostAllOfTheTime = "15",
  NoneRequired = "n/a",
}
export enum AdvantageContainerType {
  Group,
  MetaTrait,
  Race,
  AlternativeAbilities,
}
export function selfControlString(cr: SelfControlRoll): string {
  switch (cr) {
    case SelfControlRoll.Never:
      return "CR: N/A (Cannot Resist)";
    case SelfControlRoll.Rarely:
      return "CR: 6 (Resist Rarely)";
    case SelfControlRoll.FairlyOften:
      return "CR: 9 (Resist Fairly Often)";
    case SelfControlRoll.QuiteOften:
      return "CR: 12 (Resist Quite Often)";
    case SelfControlRoll.AlmostAllOfTheTime:
      return "CR: 15 (Resist Almost All Of The Time)";
    default:
      return "None Required";
  }
}
function selfControlMultiplier(cr: SelfControlRoll) {
  switch (cr) {
    case SelfControlRoll.Never:
      return 2.5;
    case SelfControlRoll.Rarely:
      return 2;
    case SelfControlRoll.FairlyOften:
      return 1.5;
    case SelfControlRoll.QuiteOften:
      return 1;
    case SelfControlRoll.AlmostAllOfTheTime:
      return 0.5;
    case SelfControlRoll.NoneRequired:
      return 1;
    default:
      return 1;
  }
}
export class Advantage extends Item {
  type = new Set<AdvantageType>([AdvantageType.Physical]);
  name = "New Advantage";
  cr = SelfControlRoll.NoneRequired;
  hasLevels = false;
  private _levels = 0;
  points = 0;
  pointsPerLevel = 0;
  reference = "";
  containerType = AdvantageContainerType.Group;
  modifiers = [];
  allowHalfLevels = false;
  private _halfLevel = false;
  roundCostDown = false;
  disabled = false;
  static fromData(data: Partial<Record<string, any>>) {}
  constructor() {
    super();
  }
  get enabled() {
    return !this.disabled;
  }
  set enabled(bool: boolean) {
    this.disabled = !bool;
  }
  get halfLevel() {
    return this._halfLevel;
  }
  set halfLevel(has: boolean) {
    if (this.allowHalfLevels) {
      this._halfLevel = has;
    }
  }
  get levels(): number {
    return this._levels;
  }
  set levels(levels: number) {
    if (this.hasLevels) {
      this._levels = levels;
    }
  }
  private _toggleType(toggle: boolean, type: AdvantageType) {
    if (toggle === true) {
      this.type.add(type);
    } else if (toggle === false) {
      this.type.delete(type);
    }
  }
  get isMental() {
    return this.type.has(AdvantageType.Mental);
  }
  set isMental(toggle: boolean) {
    this._toggleType(toggle, AdvantageType.Mental);
  }
  get isPhysical() {
    return this.type.has(AdvantageType.Physical);
  }
  set isPhysical(toggle: boolean) {
    this._toggleType(toggle, AdvantageType.Physical);
  }
  get isSocial() {
    return this.type.has(AdvantageType.Social);
  }
  set isSocial(toggle: boolean) {
    this._toggleType(toggle, AdvantageType.Social);
  }
  get isExotic() {
    return this.type.has(AdvantageType.Exotic);
  }
  set isExotic(toggle: boolean) {
    this._toggleType(toggle, AdvantageType.Exotic);
  }
  get isSupernatural() {
    return this.type.has(AdvantageType.Supernatural);
  }
  set isSupernatural(toggle: boolean) {
    this._toggleType(toggle, AdvantageType.Supernatural);
  }
  getType() {
    return "advantage" as const;
  }
  getAdjustedPoints(): number {
    let leveledCost: number = this.hasLevels
      ? this.levels * this.pointsPerLevel
      : 0;
    let multiplier = selfControlMultiplier(this.cr);
    let finalCost = (leveledCost + this.points) * multiplier;
    return this.roundCostDown ? Math.floor(finalCost) : Math.ceil(finalCost);
  }
  get adjustedPoints() {
    return this.getAdjustedPoints();
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
      reference: this.reference,
      base_points: this.points,
      points_per_level: this.pointsPerLevel,
      levels: this.levels,
      has_levels: this.hasLevels,
      cr: this.cr,
      disabled: this.disabled,
      round_down: this.roundCostDown,
      allow_half_levels: this.allowHalfLevels,
      container_type: this.containerType,
      modifiers: [],
      cr_adj: null,
      mental: this.isMental,
      physical: this.isPhysical,
      social: this.isSocial,
      exotic: this.isExotic,
      supernatural: this.isSupernatural,
    };
  }
  loadGcs(data: any) {
    try {
      super.loadGcs(data);
      const {
        reference,
        base_points,
        points_per_level,
        levels,
        has_levels = Number.isNaN(+levels),
        cr,
        disabled,
        round_down,
        allow_half_levels,
        container_type,
        modifiers,
        cr_adj,
        mental,
        physical,
        social,
        exotic,
        supernatural,
      } = data;
      if (reference != null) this.reference = reference;
      if (!Number.isNaN(+base_points)) this.points = +base_points;
      if (!Number.isNaN(+points_per_level))
        this.pointsPerLevel = +points_per_level;
      if (!Number.isNaN(+levels)) this.levels = +levels;
      if (typeof has_levels === "boolean") this.hasLevels = has_levels;
      if (cr != null) this.cr = cr;
      if (typeof disabled === "boolean") this.disabled = disabled;
      if (typeof round_down === "boolean") this.roundCostDown = round_down;
      if (typeof allow_half_levels === "boolean")
        this.allowHalfLevels = allow_half_levels;
      if (container_type != null) this.containerType = container_type;
      if (typeof mental === "boolean") this.isMental = mental;
      if (typeof physical === "boolean") this.isPhysical = physical;
      if (typeof social === "boolean") this.isSocial = social;
      if (typeof exotic === "boolean") this.isExotic = exotic;
      if (typeof supernatural === "boolean") this.isSupernatural = supernatural;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
