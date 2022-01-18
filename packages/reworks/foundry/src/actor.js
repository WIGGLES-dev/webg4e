import { SystemDocumentMixin } from "./util.js"
export class SystemActor extends SystemDocumentMixin(Actor) {
  prepareCharacterExtendedEquipmentWeights() {
    const equipment = this.itemTypes.equipment
    for (const item of equipment) {
      Object.assign(this.source.data, { containedWeight: 0, containedValue: 0 })
      for (const nestedItem of iterEmbeddedDescendants(item)) {
        item.source.data.containedWeight += nestedItem.source.data.eWeight
        item.source.data.containedValue += nestedItem.source.data.eValue
      }
    }
  }
  prepareCharacter() {
    this.prepareCharacterExtendedEquipmentWeights()
    const { skill: skills, equipment: items, trait: traits } = this.itemTypes
    let pointsSpentSkills = 0
    let pointsSpentTechniques = 0
    let pointsSpentTraits = 0
    let pointsSpentPerks = 0
    let pointsSpentQuirks = 0
    let carriedEquipmentWeight = 0
    for (const skill of skills) {
      const {
        data: { points, isTechnique },
      } = skill.source
      if (skillData.isTechnique) {
        pointsSpentTechniques += points
      } else {
        pointsSpentSkills += points
      }
    }
    for (const item of items) {
      const {
        data: { weight, quantity, equipped },
      } = item.source
      if (equipped) {
        carriedEquipmentWeight += weight * quantity
      }
    }
    for (const trait of traits) {
      const {
        data: { points },
      } = trait.source
    }
    let pointsSpent =
      pointsSpentSkills +
      pointsSpentTechniques +
      pointsSpentTraits +
      pointsSpentPerks +
      pointsSpentQuirks
    Object.assign(this.source.data, { pointsSpent })
  }
  prepareParty() {}
  applyActiveEffects() {
    for (const effect of this.iterEmbeddedEffects()) {
      const feature = effect.getFlag(game.system.id, "feature")
      if (feature) {
        const { type, amount, to, qualifiers } = feature
      }
    }
  }
}
