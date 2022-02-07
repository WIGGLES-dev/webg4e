import { pipe } from "./util.js"
import { SystemDocumentMixin } from "./mixins/document.js"
import { Weapons } from "./model/weapon.js"

export class SystemItem extends pipe(SystemDocumentMixin, Weapons)(Item) {}

export class Trait extends SystemItem {
  static cr = {
    Never: 0,
    Rarely: 1,
    FairlyOften: 2,
    QuiteOften: 3,
    AlmostAllOfTheTime: 4,
    NoneRequired: 5,
  }
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    const {
      roundDown = false,
      hasLevels = false,
      hasHalfLevel = false,
      basePointCost = 0,
      levels = 0,
      leveledPointCost = 0,
    } = this.model
    const modifiers = this.getSystemFlag("modifiers") || []
    let points = basePointCost
    if (hasLevels) points += levels * leveledPointCost
    if (hasHalfLevel) points += leveledPointCost / 2
    points = (roundDown ? Math.floor : Math.ceil)(points)
    Object.assign(this.model, {
      points,
    })
  }
}
export class Skill extends SystemItem {
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    let { points = 0, difficulty = 0, attr } = this.model
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
    Object.assign(this.model, {
      rsl,
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
