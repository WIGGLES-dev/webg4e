import { Character } from "../character/character";
import { Skill } from "./skill";

export enum SkillDefaultType {
  Ten = "10",
  Skill = "skill",
  Block = "block",
  Parry = "parry",
}
export class SkillDefault {
  type: SkillDefaultType | string = SkillDefaultType.Skill;
  name?: string;
  specialization?: string;
  modifier = 0;
  level?: number;
  adjLevel?: number;
  points?: number;
  matchesSkill(skill: Skill): boolean {
    let nameMatches = true;
    let specializationMatches = true;
    const canMatchName = typeof this.name === "string" && !!this.name;
    const canMatchSpecialization =
      typeof this.specialization === "string" && !!this.specialization;
    if (canMatchName) {
      nameMatches = canMatchName && skill.name === this.name;
    }
    if (canMatchSpecialization) {
      specializationMatches =
        canMatchSpecialization && skill.specialization === this.specialization;
    }
    return nameMatches && specializationMatches;
  }
  saveGcs() {
    return {
      type: this.type,
      name: this.name,
      specialization: this.specialization,
      modifier: this.modifier,
      level: this.level,
      adjusted_level: this.adjLevel,
      points: this.points,
    };
  }
  loadGcs(data: any) {
    try {
      const {
        type,
        name,
        specialization,
        modifier,
        level,
        adjusted_level,
        points,
      } = data;
      if (type != null) this.type = type;
      if (name != null) this.name = name;
      if (specialization != null) this.specialization = specialization;
      if (modifier != null) this.modifier = modifier;
      if (level != null) this.level = level;
      if (points != null) this.points = points;
      if (adjusted_level != null) this.adjLevel = adjusted_level;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
