import { Character } from "../character/character";
import { Dice } from "../dice";
export enum WeaponStrength {
  None = "",
  Swing = "sw",
  Thrust = "thr",
}
export class WeaponDamage {
  st = WeaponStrength.None;
  base = Dice.from(0, 0);
  armorDivisor = 1;
  fragmentation = "";
  fragmentationArmorDivisor = 1;
  fragmentationType = "";
  modifierPerDie = 0;
  constructor() {}
  toString(character?: Character) {
    if (!character) return "";
    let base = this.base.clone();
    switch (this.st) {
      case WeaponStrength.Swing: {
        base.addDice(character.getSwing());
        break;
      }
      case WeaponStrength.Thrust: {
        base.addDice(character.getThrust());
        break;
      }
    }
    return base.toString();
  }
  saveGcs() {
    return {
      st: this.st,
      base: this.base?.toString(),
      fragmentation: this.fragmentation,
      armor_divisor: this.armorDivisor,
      fragmentation_armor_divisor: this.fragmentationArmorDivisor,
      modifer_per_die: this.modifierPerDie,
    };
  }
  loadGcs(data: any) {
    try {
      const {
        st,
        base,
        fragmentation,
        armor_divisor,
        fragmentation_armor_divisor,
        modifier_per_die,
      } = data;
      if (typeof st === "string") this.st = st as WeaponStrength;
      if (typeof base === "string") this.base = Dice.fromString(base);
      if (typeof fragmentation === "string") this.fragmentation = fragmentation;
      this.armorDivisor = armor_divisor;
      this.fragmentationArmorDivisor = fragmentation_armor_divisor;
      this.modifierPerDie = modifier_per_die;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
