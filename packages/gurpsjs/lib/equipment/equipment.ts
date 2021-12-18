import { Item } from "../base/item";
import { WeaponStats } from "../weapon/weapon-stats";
export class Equipment extends Item {
  name = "New Equipment";
  equipped = true;
  quantity = 0;
  uses = 0;
  maxUses = 0;
  techLevel = "";
  legalityClass = "";
  private _value = 0;
  get value() {
    return +this._value.toFixed(3);
  }
  set value(value: number) {
    this._value = value || 0;
  }
  private _weight = 0;
  get weight() {
    return +this._weight.toFixed(3);
  }
  set weight(weight: number) {
    this._weight = weight || 0;
  }
  weightIgnoredForSkills = false;
  reference = "";
  modifiers: unknown[] = [];
  location = "carried";
  constructor() {
    super();
  }
  get eValue() {
    return +(this.quantity * this.value).toFixed(3);
  }
  get eWeight() {
    return +(this.quantity * this.weight).toFixed(3);
  }
  getType() {
    return "equipment" as const;
  }
  saveGcs(merge?: Record<string, any>) {
    return {
      ...super.saveGcs(),
      equipped: this.equipped,
      quantity: this.quantity,
      uses: this.uses,
      max_uses: this.maxUses,
      description: this.name,
      tech_level: this.techLevel,
      legality_class: this.legalityClass,
      value: this.value,
      weight: this.weight,
      ignore_weight_for_skills: this.weightIgnoredForSkills,
      reference: this.reference,
      modifiers: this.modifiers,
      location: this.location,
    };
  }
  loadGcs(data: any, merge?: Record<string, any>): this {
    try {
      super.loadGcs(data, merge);
      let {
        equipped,
        quantity,
        uses,
        max_uses,
        description,
        tech_level,
        legality_class,
        value,
        weight,
        ignore_weight_for_skills,
        reference,
        modifiers,
        location,
      } = { ...data, ...merge } as any;
      weight = Number.parseFloat(weight);
      value = Number.parseFloat(value);
      if (typeof equipped === "boolean") this.equipped = equipped;
      if (typeof quantity === "number") this.quantity = quantity;
      if (typeof uses === "number") this.uses = uses;
      if (!Number.isNaN(value)) this.value = value;
      if (!Number.isNaN(weight)) this.weight = weight;
      if (typeof reference === "string") this.reference = reference;
      if (typeof location === "string") this.location = location;
      if (typeof description === "string") this.name = description;
      if (typeof max_uses === "number") this.maxUses = max_uses;
      if (typeof tech_level === "string") this.techLevel = tech_level;
      if (typeof legality_class === "string")
        this.legalityClass = legality_class;
      if (typeof ignore_weight_for_skills === "boolean")
        this.weightIgnoredForSkills = ignore_weight_for_skills;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
