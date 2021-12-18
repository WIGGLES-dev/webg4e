import { Item } from "../base/item";
import { Character } from "../character/character";
import { SkillDefault } from "./skill-default";

export interface SkillLike {
  points: number;
  mod: number;
  attribute: string;
  difficulty: SkillDifficulty;
  baseLevel: number;
  relativeLevel: number;
  attributeLevel(character: Character): number;
  calculateLevel(character: Character): number;
}
export type GConstructor<T> = abstract new (...args: any[]) => T;
export const SL = <T extends GConstructor<any>>(Base: T) => {
  abstract class SkillLikeMixin extends Base implements SkillLike {
    character?: Character;
    points = 1;
    mod = 0;
    attribute = "iq";
    difficulty = SkillDifficulty.Average;
    constructor(...args: any[]) {
      super(...args);
    }
    withCharacter(character: Character): this {
      this.character = character;
      return this;
    }
    get baseLevel(): number {
      switch (this.difficulty) {
        case SkillDifficulty.Easy:
          return 0;
        case SkillDifficulty.Average:
          return -1;
        case SkillDifficulty.Hard:
          return -2;
        case SkillDifficulty.VeryHard:
          return -3;
        case SkillDifficulty.Wildcard:
          return -4;
        default:
          return 0;
      }
    }
    get relativeLevel(): number {
      let relativeLevel = this.baseLevel;
      let points = this.points;
      const difficulty = this.difficulty;
      if (difficulty === SkillDifficulty.Wildcard) {
        points /= 3;
      }
      if (points === 1) {
      } else if (points < 4) {
        relativeLevel++;
      } else {
        relativeLevel += 1 + points / 4;
      }
      return relativeLevel;
    }
    attributeLevel(character: Character): number {
      return character.getAttributeCurrentValue(this.attribute) || 10;
    }
    calculateLevel(character = this.character) {
      if (!character) return 0;
      const attributeLevel = this.attributeLevel(character);
      const relativeLevel = this.relativeLevel;
      const level = attributeLevel + relativeLevel;
      return Math.floor(level) + this.mod;
    }
    get level() {
      return this.calculateLevel();
    }
    saveGcs() {
      return {
        ...super.saveGcs(),
        // defaults: this.defaults.map((sd) => sd.saveGcs()),
        difficulty: `${this.attribute}/${this.difficulty}`,
        points: this.points,
        mod: this.mod,
        //enumbrance_penalty_multiplier: this.enumbrancePenaltyMultiplier,
        //defaulted_from: undefined,
      };
    }
    loadGcs(data: any) {
      try {
        super.loadGcs(data);
        let {
          points,
          mod,
          // enumbrance_penalty_multiplier,
          // defaulted_from,
        } = data;
        const [attribute, difficulty] = data.difficulty?.split("/") ?? [];
        if (difficulty != null) this.difficulty = difficulty;
        if (attribute != null) this.attribute = attribute;
        if (!Number.isNaN(+points)) this.points = +points;
        if (!Number.isNaN(+mod)) this.mod = +mod;
        // if (enumbrance_penalty_multiplier != null)
        //   this.enumbrancePenaltyMultiplier = this.enumbrancePenaltyMultiplier;
      } catch (err) {
        console.error(err);
      }
      return this;
    }
  }
  return SkillLikeMixin;
};

export enum SkillDifficulty {
  Easy = "e",
  Average = "a",
  Hard = "h",
  VeryHard = "vh",
  Wildcard = "w",
}
export class Skill extends SL(Item) {
  name = "New Skill";
  specialization?: string;
  techLevel?: string;
  reference = "";
  enumbrancePenaltyMultiplier = 0;
  defaults: SkillDefault[] = [];

  constructor() {
    super();
  }
  get formattedName() {
    let name = this.name;
    if (this.specialization) name += ` (${this.specialization})`;
    return name;
  }
  get relativeLevel(): number {
    let relativeLevel = this.baseLevel;
    let points = this.points;
    if (this.difficulty === SkillDifficulty.Wildcard) {
      points /= 3;
    }
    if (points === 1) {
    } else if (points < 4) {
      relativeLevel++;
    } else {
      relativeLevel += 1 + points / 4;
    }
    return relativeLevel;
  }
  get rsl() {
    return "";
  }
  getType() {
    return "skill" as const;
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
      specialization: this.specialization,
      defaults: this.defaults.map((sd) => sd.saveGcs()),
      tech_level: this.techLevel,
      difficulty: `${this.attribute}/${this.difficulty}`,
      points: this.points,
      reference: this.reference,
      enumbrance_penalty_multiplier: this.enumbrancePenaltyMultiplier,
      defaulted_from: undefined,
    };
  }
  loadGcs(data: any) {
    try {
      super.loadGcs(data);
      let {
        specialization,
        tech_level,
        reference,
        enumbrance_penalty_multiplier,
        defaulted_from,
        defaults,
      } = data;
      if (specialization != null) this.specialization = specialization;
      if (tech_level != null) this.techLevel = tech_level;
      if (typeof reference === "string") this.reference = reference;
      if (enumbrance_penalty_multiplier != null)
        this.enumbrancePenaltyMultiplier = this.enumbrancePenaltyMultiplier;
      if (defaults instanceof Array) {
        this.defaults = defaults.map((sd) => new SkillDefault().loadGcs(sd));
      }
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
