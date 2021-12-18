import { Item } from "../base/item";
import { Character } from "../character/character";
import { SkillDifficulty, SL } from "../skill/skill";
import { SkillDefault } from "../skill/skill-default";
export type TechniqueDifficulty =
  | SkillDifficulty.Average
  | SkillDifficulty.Hard;
export class Technique extends SL(Item) {
  name = "New Technique";
  get formattedName() {
    let name = "";
    name += this.name;
    if (this.default.type === "skill") {
      if (this.default.name) {
        name += " (";
        name += this.default.name;
        name += ")";
      }
    }
    return name;
  }
  limit?: number;
  difficulty: TechniqueDifficulty = SkillDifficulty.Average;
  default = new SkillDefault();
  reference = "";
  constructor() {
    super();
  }
  getBaseLevel(character: Character) {
    if (!this.default) return 0;
    const base = character.getBestLevelFromDefaults([this.default]);
    return base;
  }
  calculateLevel(character = this.character): number {
    if (!character) return 0;
    let relativeLevel = 0;
    let level = 0;
    let points = this.points;
    level = this.getBaseLevel(character);
    let baseLevel = level;
    if (this.difficulty === SkillDifficulty.Hard) {
      points--;
    }
    if (points > 0) {
      relativeLevel = points;
    }
    if (level !== 0) {
      level += relativeLevel;
    }
    if (typeof this.limit === "number") {
      let max = baseLevel + this.limit;
      if (level > max) {
        relativeLevel -= level - max;
        level = max;
      }
    }
    return Math.floor(level) + this.mod;
  }
  getType() {
    return "technique" as const;
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
      difficulty: this.difficulty,
      default: this.default?.saveGcs(),
    };
  }
  loadGcs(data: any) {
    try {
      super.loadGcs(data);
      const { default: sd, difficulty, reference } = data;
      if (typeof sd === "object") this.default = new SkillDefault().loadGcs(sd);
      if (typeof difficulty === "string")
        this.difficulty = difficulty as TechniqueDifficulty;
      if (typeof reference === "string") this.reference = reference;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
