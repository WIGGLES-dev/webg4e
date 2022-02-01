import { SystemDocumentMixin, pipe } from "./util.js"
import { Weapons } from "./model/weapon.js"
export class SystemActor extends SystemDocumentMixin(Actor) {}
export class Character extends pipe(Weapons)(SystemActor) {
  getAttribute(attr) {
    const { attributes = {} } = this.model
    return attributes[attr]
  }
  setAttribute(attr, value) {}
  prepareFeatures() {
    const featureMap = {}
    for (const item of this.items.values()) {
      const features = item.getFlag(game.system.id, "features")
      if (features) {
        featureMap[item.id] = features
      }
    }
    return featureMap
  }
  prepareWeapons() {
    const allWeapons = []
    for (const item of this.items.values()) {
      const weapons = item.model.weapons
      if (weapons == null) continue
      for (const weapon of weapons) {
        allWeapons.push({
          ...weapon,
        })
      }
    }
    Object.assign(this.model, { allWeapons })
  }
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    this.prepareFeatures()
    this.prepareWeapons()
    const { skill: skills, equipment: items, trait: traits } = this.itemTypes
    let pointsSpentSkills = 0
    let pointsSpentTechniques = 0
    let pointsSpentTraits = 0
    let pointsSpentPerks = 0
    let pointsSpentQuirks = 0
    let carriedWeight = 0
    for (const skill of skills) {
      const { points, isTechnique } = skill.model
      if (isTechnique) {
        pointsSpentTechniques += points
      } else {
        pointsSpentSkills += points
      }
    }
    for (const item of items) {
      const { weight, quantity, equipped } = item.model
      if (equipped) {
        carriedWeight += weight * quantity
      }
    }
    for (const trait of traits) {
      const { points } = trait.model
    }
    const strength = this.getAttribute("strength")
    const basicLift = (strength * strength) / 10
    const encumbranceThresholds = {
      none: basicLift,
      light: basicLift * 2,
      medium: basicLift * 4,
      heavy: basicLift * 6,
      xheavy: basicLift * 8,
    }
    const encumbranceLevel = 0
    const liftingThresholds = {}
    let pointsSpent =
      pointsSpentSkills +
      pointsSpentTechniques +
      pointsSpentTraits +
      pointsSpentPerks +
      pointsSpentQuirks
    Object.assign(this.model, {
      pointsSpent,
      basicLift,
      encumbranceThresholds,
      encumbranceLevel,
      liftingThresholds,
      carriedWeight,
    })
  }
}
export class Party {}
