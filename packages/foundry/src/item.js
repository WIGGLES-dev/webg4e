import { SystemDocumentMixin } from "./mixins/document.js"

export class SystemItem extends SystemDocumentMixin(Item) {
  prepareBaseData() {
    super.prepareBaseData(...arguments)
  }
}

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
    if (points <= 0) {
    } else if (points === 1) {
    } else if (points < 4) {
      rsl++
    } else if (points >= 4) {
      rsl += 1 + points / 4
    }
    const base = this.parent.getAttribute(attr)?.level ?? 10
    const level = Math.floor(base + rsl)
    Object.assign(this.model, {
      rsl,
      base,
      level,
    })
  }
}
export class Equipment extends SystemItem {
  prepareBaseData() {
    super.prepareBaseData(...arguments)
  }
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

export class HitLocation extends SystemItem {}

export class Attribute extends SystemItem {}
