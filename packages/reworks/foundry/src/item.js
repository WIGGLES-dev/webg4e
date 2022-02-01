import { SystemDocumentMixin, pipe } from "./util.js"
import { Weapons } from "./model/weapon.js"

export class SystemItem extends pipe(SystemDocumentMixin, Weapons)(Item) {}

export class Trait extends SystemItem {
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    const { basePointCost, levels, leveledPointCost } = this.model
    Object.assign(this.model, {
      points: basePointCost + levels * leveledPointCost,
    })
  }
}
export class Skill extends SystemItem {
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    let { points = 0, difficulty = 0 } = this.model
    if (difficulty === -4) {
      points /= 3
    }
    let rsl = difficulty
    if (points === 1) {
    } else if (points < 4) {
      rsl++
    } else {
      rsl += 1 + points / 4
    }
    let base = 10
    let level = Math.floor(base + rsl)
    Object.assign(this.model, {
      level,
    })
  }
}
export class Equipment extends SystemItem {
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    const { weight, value, quantity } = this.model
    let eWeight = weight * quantity
    let eValue = value * quantity
    let containedWeight = eWeight
    let containedValue = eValue
    for (const item of this.iterEmbeddedDescendants()) {
    }
    Object.assign(this.model, {
      eWeight,
      eValue,
      containedWeight,
      containedValue,
    })
  }
}
