import { SystemDocumentMixin } from "./util.js"

export class SystemItem extends SystemDocumentMixin(Item) {
  prepareSkill() {
    const { points, difficulty } = this.model
    let base = 0
    if (points < 4) {
      base++
    } else {
      base += points / 4
    }
    Object.assign(this.model, {
      level: 0,
    })
  }
  prepareEquipment() {
    const { weight, value, quantity } = this.model
    Object.assign(this.model, {
      eWeight: weight * quantity,
      eValue: value * quantity,
    })
  }
  prepareTrait() {
    const { basePointCost, levels, leveledPointCost } = this.model
    Object.assign(this.model, {
      points: basePointCost + levels * leveledPointCost,
    })
  }
  applyActiveEffects() {
    for (const effect of this.effects.values()) {
    }
  }
}
