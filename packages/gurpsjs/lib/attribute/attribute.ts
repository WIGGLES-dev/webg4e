import { AttributeDef } from "./attribute-def";
import type { Character } from "../character/character";
export class Attribute {
  private _adjustment = 0;
  private _bonus = 0;
  private _costReduction = 0;
  private _damage = 0;
  constructor(public id: string) {}
  getDef(character: Character): AttributeDef | undefined {
    if (this.id) {
      return character.settings.attributes.get(this.id);
    }
  }
  initTo(adjustment: number, damage: number) {
    this._adjustment = adjustment;
    this._damage = damage;
  }

  getCurrentThreshold() {}
  getPointCost(character: Character): number {
    return (
      this.getDef(character)?.computeCost(
        character,
        this._adjustment,
        this._costReduction
      ) ?? 0
    );
  }
  getCurrentValue(character: Character): number {
    const def = this.getDef(character);
    if (def != null) {
      const base = def.getBaseValue(character);
      const value = base + this._adjustment + this._bonus;
      return Math.ceil(value);
    }
    return 0;
  }
  setCurrentValue(character: Character, value: number) {
    const old = this.getCurrentValue(character);
    if (old != value) {
      const def = this.getDef(character);
      if (def != null) {
        this._adjustment = value - (def.getBaseValue(character) + this.bonus);
        character.set(character);
      }
    }
  }
  setValue() {}
  get bonus() {
    return this._bonus;
  }
  setBonus() {}
  setCostReduction() {}
  get damage() {
    return this._damage;
  }
  set damage(damage: number) {
    this._damage = damage;
  }
  getRemaining(character: Character) {
    return this.getCurrentValue(character) - this._damage;
  }
  setDamage(character: Character, newCurrent: number) {
    const current = this.getCurrentValue(character);
    this.damage = current - newCurrent;
    character.set(character);
  }
  saveGcs() {
    return {
      attr_id: this.id,
      adj: this._adjustment,
      damage: this._damage,
    };
  }
  loadGcs(data: any) {
    try {
      const {} = data;
    } catch (err) {}
    return this;
  }
}
