import type { HitLocationTable } from "./hit-location-table";
export class HitLocation {
  id?: string;
  choiceName = "";
  tableName = "";
  slots?: number;
  rollRange = "";
  hitPenalty = 0;
  DRBonus = 0;
  description = "";
  owningTable?: HitLocationTable;
  subTable?: HitLocationTable;
  constructor() {}
  saveGcs() {
    return {
      id: this.id,
      choice_name: this.choiceName,
      table_name: this.tableName,
      slots: this.slots,
      hit_penalty: this.hitPenalty,
      dr_bonus: this.DRBonus,
      description: this.description,
      sub_table: this.subTable,
    };
  }
  loadGcs(data: any) {
    try {
      const {
        id,
        choice_name,
        table_name,
        slots,
        hit_penalty,
        dr_bonus,
        description,
        sub_table,
      } = data;
      if (typeof id === "string") this.id = id;
      if (typeof choice_name === "string") this.choiceName = choice_name;
      if (typeof table_name === "string") this.tableName = table_name;
      this.slots = slots;
      if (typeof hit_penalty === "number") this.hitPenalty = hit_penalty;
      if (typeof dr_bonus === "number") this.DRBonus = dr_bonus;
      if (typeof description === "string") this.description = description;
      this.subTable = sub_table;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
