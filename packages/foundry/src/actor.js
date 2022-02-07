import { pipe } from "./util.js"
import { SystemDocumentMixin } from "./mixins/document.js"
import { Weapons } from "./model/weapon.js"
import { DamageProgression } from "./formula.js"
export class SystemActor extends SystemDocumentMixin(Actor) {}
export class Character extends pipe(Weapons)(SystemActor) {
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
  getAttribute(id) {
    const { attributes = [] } = this.model
    return attributes.find((attr) => attr.id === id)
  }
  static attributeFunctionHash = {}
  static getAttributeFunction(formula) {
    if (!(formula in this.attributeFunctionHash)) {
      let expression = formula
      expression = expression.replace(/\+/g, " + ")
      expression = expression.replace(/\-/g, " - ")
      expression = expression.replace(/\//g, " / ")
      expression = expression.replace(/\*/, " * ")
      expression = expression.replace(/\(/g, " ( ")
      expression = expression.replace(/\)/g, " ) ")
      let variables = []
      let looping = true
      let currentIndex = -1
      while (looping) {
        const nextI = expression.indexOf("$", currentIndex + 1)
        if (nextI === -1) {
          break
        } else {
          currentIndex = nextI
          const [variable] = expression.slice(currentIndex).split(" ")
          variables.push(variable)
        }
      }
      const func = new Function(
        ...variables,
        "floor",
        "max",
        "ceil",
        "min",
        "round",
        `return ${expression}`
      )
      const compute = (scope) => {
        const resolved = {}
        const resolve = (variable) => {
          const id = variable.slice(1)
          const attr = scope[id]
          const { featureBonus = 0, increasedLevel = 0 } = attr
          if (!(id in resolved)) {
            resolved[id] =
              this.getAttributeFunction(scope[id].attribute_base)(
                scope,
                resolved
              ) +
              featureBonus +
              increasedLevel
          }
          return resolved[id]
        }
        try {
          const base = func(
            ...variables.map(resolve),
            Math.floor,
            Math.ceil,
            Math.min,
            Math.round
          )
          return base
        } catch (err) {
          console.error(err)
          return 0
        }
      }
      this.attributeFunctionHash[formula] = compute
    }
    return this.attributeFunctionHash[formula]
  }
  prepareAttributes() {
    const scope = {}
    const { attributes = [], attributeLevels = {} } = this.model
    for (const attr of attributes) {
      const { id, cost_per_point = 0, increasedLevel = 0 } = attr
      scope[id] = attr
      const featureBonus = 0
      const pointsSpent = increasedLevel * cost_per_point
      Object.assign(attr, {
        increasedLevel,
        featureBonus,
        pointsSpent,
      })
    }
    for (const attr of attributes) {
      const { id, increasedLevel, featureBonus, attribute_base, current } = attr
      const level =
        Character.getAttributeFunction(attribute_base)(scope) +
        increasedLevel +
        featureBonus
      if (current === undefined) Object.assign(attr, { current: level })

      Object.assign(attr, {
        value: attr.current,
        max: level,
        level,
      })
    }
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
    this.prepareAttributes()
    this.prepareWeapons()
    const { skill: skills, equipment: items, trait: traits } = this.itemTypes
    let pointsSpentSkills = 0
    let pointsSpentTechniques = 0
    let pointsSpentTraits = 0
    let pointsSpentPerks = 0
    let pointsSpentQuirks = 0
    let carriedWeight = 0
    for (const skill of skills) {
      const { points, isTechnique, attr, rsl } = skill.model
      if (isTechnique) {
        pointsSpentTechniques += points
      } else {
        pointsSpentSkills += points
      }
      let base = this.getAttribute(attr)?.level ?? 10
      let level = base + rsl
      Object.assign(skill.model, {
        level,
      })
      skill.notifyData()
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
    const strength = this.getAttribute("st")
    const st = strength.level
    const basicLift = Math.floor((st * st) / 5)
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
    const progression = DamageProgression.BasicSet
    const swing = progression.calculateSwing(st).toString()
    const thrust = progression.calculateThrust(st).toString()
    Object.assign(this.model, {
      pointsSpent,
      basicLift,
      encumbranceThresholds,
      encumbranceLevel,
      liftingThresholds,
      carriedWeight,
      swing,
      thrust,
    })
  }
}
export class Party {}
