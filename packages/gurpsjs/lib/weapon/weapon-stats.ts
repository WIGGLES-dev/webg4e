import type { Character } from "../character/character";
import { SkillDefault } from "../skill/skill-default";
import { WeaponDamage } from "./weapon-damage";

export abstract class WeaponStats {
  damage = new WeaponDamage();
  strength = "";
  usage = "";
  usageNotes = "";
  defaults: SkillDefault[] = [];
  constructor() {}
  abstract getType(): string;
  getSkillLevel(character?: Character): number {
    if (!character) return 0;
    return character.getBestLevelFromDefaults(this.defaults);
  }
  saveGcs() {
    const defaults = this.defaults.map((sd) => sd.saveGcs());
    return {
      type: this.getType(),
      strength: this.strength,
      usage: this.usage,
      usage_notes: this.usageNotes,
      damage: this.damage.saveGcs(),
      defaults,
    };
  }
  loadGcs(data: any) {
    try {
      const { damage, strength, usage, usage_notes, defaults } = data;
      if (typeof damage === "object") this.damage.loadGcs(damage);
      if (typeof strength === "string") this.strength = strength;
      if (typeof usage === "string") this.usage = usage;
      if (typeof usage_notes === "string") this.usageNotes = usage_notes;
      if (defaults instanceof Array) {
        this.defaults = defaults.map((data: any) => {
          const skillDefault = new SkillDefault();
          skillDefault.loadGcs(data);
          return skillDefault;
        });
      }
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
