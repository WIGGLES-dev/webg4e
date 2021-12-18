import { Item } from "../base/item";
import { Character } from "../character/character";
import { Skill, SkillDifficulty, SL } from "../skill/skill";
export class Spell extends SL(Item) {
  name = "New Spell";
  techLevel = "";
  college: string[] = [];
  powerSource = "Arcane";
  spellClass = "";
  resist = "";
  castingCost = "";
  maintenanceCost = "";
  castingTime = "";
  duration = "";
  reference = "";

  getType() {
    return "spell" as const;
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
      tech_level: this.techLevel,
      college: this.college,
      power_source: this.powerSource,
      spell_class: this.spellClass,
      resist: this.resist,
      casting_cost: this.castingCost,
      maintenance_cost: this.maintenanceCost,
      casting_time: this.castingTime,
      duration: this.duration,
      points: this.points,
      difficulty: `${this.attribute}/${this.difficulty}`,
      reference: this.reference,
    };
  }
  loadGcs(data: any) {
    super.loadGcs(data);
    try {
      const [attribute, difficulty] = data.difficulty?.split("/") ?? [];
      const {
        tech_level,
        college,
        power_source,
        spell_class,
        resist,
        casting_cost,
        maintenance_cost,
        casting_time,
        duration,
        reference,
      } = data;
      if (attribute != null) this.attribute = attribute;
      if (tech_level != null) this.techLevel = tech_level;
      if (college instanceof Array) this.college = college;
      if (power_source != null) this.powerSource = power_source;
      if (spell_class != null) this.spellClass = spell_class;
      if (resist != null) this.resist = resist;
      if (casting_cost != null) this.castingCost = casting_cost;
      if (maintenance_cost != null) this.maintenanceCost = maintenance_cost;
      if (casting_time != null) this.castingTime = casting_time;
      if (duration != null) this.duration = duration;
      if (reference != null) this.reference = reference;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
