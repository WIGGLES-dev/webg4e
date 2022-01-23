import { SystemDocumentMixin } from "./util.js"
export class SystemActor extends SystemDocumentMixin(Actor) {
  prepareRecursiveValues() {
    const equipment = this.itemTypes.equipment
    for (const item of equipment) {
      Object.assign(this.model, { containedWeight: 0, containedValue: 0 })
      for (const nestedItem of item.iterEmbeddedDescendants()) {
        item.source.data.containedWeight += nestedItem.source.data.eWeight
        item.source.data.containedValue += nestedItem.source.data.eValue
      }
    }
  }
  prepareFeatures() {
    const featureMap = {}
    for (const item of this.items.values()) {
      const features = item.getFlag(game.system.id, "features")
      if (features) {
        featureMap[item.id] = features
      }
    }
  }
  getAttribute(attr) {
    const { attributes = {} } = this.model
    return attributes[attr]
  }
  setAttribute(attr, value) {}
  prepareCharacter() {
    this.prepareRecursiveValues()
    this.prepareFeatures()
    const { skill: skills, equipment: items, trait: traits } = this.itemTypes
    let pointsSpentSkills = 0
    let pointsSpentTechniques = 0
    let pointsSpentTraits = 0
    let pointsSpentPerks = 0
    let pointsSpentQuirks = 0
    let carriedEquipmentWeight = 0
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
        carriedEquipmentWeight += weight * quantity
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
      liftingThresholds,
    })
  }
  prepareParty() {}
}
