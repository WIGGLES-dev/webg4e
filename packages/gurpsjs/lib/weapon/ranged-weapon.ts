import { WeaponStats } from "./weapon-stats";
export class RangedWeapon extends WeaponStats {
  accuracy = "";
  range = "";
  rateOfFire = "";
  shots = "";
  bulk = "";
  recoil = "";
  constructor() {
    super();
  }
  getType() {
    return "ranged_weapon" as const;
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
      range: this.range,
      rate_of_fire: this.rateOfFire,
      shots: this.shots,
      bulk: this.bulk,
      recoil: this.recoil,
    };
  }
  loadGcs(data: any) {
    try {
      super.loadGcs(data);
      const { range, rate_of_fire, shots, bulk, recoil } = data;
      if (typeof range === "string") this.range = range;
      if (typeof this.rateOfFire === "string") this.rateOfFire = rate_of_fire;
      if (typeof shots === "string") this.shots = shots;
      if (typeof bulk === "string") this.bulk = bulk;
      if (typeof recoil === "string") this.recoil = recoil;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
