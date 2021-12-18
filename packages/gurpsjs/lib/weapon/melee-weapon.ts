import { Character } from "../character/character";
import { WeaponStats } from "./weapon-stats";
export class MeleeWeapon extends WeaponStats {
  reach = "1";
  parry: number | false = 0;
  block: number | false = 0;
  constructor() {
    super();
  }
  getType() {
    return "melee_weapon" as const;
  }
  private _getDefenseString(
    character?: Character,
    bonus: number | false = character == null ? false : 0
  ) {
    if (bonus === false) {
      return "No";
    } else {
      return Math.floor(this.getSkillLevel(character) / 2 + 3 + bonus);
    }
  }
  getParryLevelString(character?: Character) {
    return this._getDefenseString(character, this.parry);
  }
  getBlockLevelString(character?: Character) {
    return this._getDefenseString(character, this.block);
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
      reach: this.reach,
      parry: this.parry,
      block: this.block,
    };
  }
  loadGcs(data: any) {
    try {
      super.loadGcs(data);
      let { reach, parry, block } = data;
      parry = Number.parseInt(parry);
      block = Number.parseInt(block);
      this.reach = reach;
      this.parry = !Number.isNaN(parry) ? parry : false;
      this.block = !Number.isNaN(block) ? block : false;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
