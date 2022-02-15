import { SystemDocumentMixin } from "./mixins/document.js"
import { DamageProgression } from "./formula.js"
export class SystemActor extends SystemDocumentMixin(Actor) {
  applyFeatures({ allowedTargets }) {
    const extract = (obj, path, stack = []) => {
      if (typeof path === "string") path = path.split(".")
      let ptr = obj
      let i = 0
      for (const key of path) {
        if (++i === path.length) {
          stack.push({
            parent: ptr,
            value: ptr[key],
            key,
          })
        } else if (key in ptr) {
          if (ptr[key] instanceof Array) {
            for (const value of ptr[key]) {
              extract(value, path.slice(1), stack)
            }
          } else {
            ptr = ptr[key]
          }
        } else {
          return stack
        }
      }
      return stack
    }
    const types = this.itemTypes
    for (const item of this.items.values()) {
      const features = item.getSystemFlag("features") || []
      for (const feature of features) {
        const {
          enabled,
          target: targetType,
          property,
          qualifiers = [],
          operation,
          amount,
          leveled,
        } = feature
        if (
          allowedTargets instanceof Array &&
          !allowedTargets.includes(targetType)
        )
          continue
        if (enabled !== true) continue
        if (property === undefined) continue
        const targets = []
        if (targetType === "this") {
          targets.push(item)
        } else if (targetType in types) {
          targets.push(...types[targetType])
        } else if (targetType === this.type) {
          targets.push(this)
        }
        for (const target of targets) {
          let qualified = true
          const operate = extract(target.data, property)
          for (const qualifier of qualifiers) {
            let {
              key: path,
              or,
              not,
              operator,
              sensitive,
              qualifier: right,
            } = qualifier
            let bool = false
            const compare = extract(target.data, path)
            if (!sensitive) {
              if (typeof left === "string" && typeof right === "string") {
                left = left.toLowerCase()
                right = right.toLocaleLowerCase()
              }
            }
            for (const { value: left } of compare) {
              switch (operator) {
                case "startswith": {
                  bool = left.startsWith(right)
                  break
                }
                case "endswith": {
                  bool = left.endsWith(right)
                  break
                }
                case "includes": {
                  bool = left.includes(right)
                  break
                }
                case ">": {
                  bool = left > right
                  break
                }
                case ">=": {
                  bool = left >= right
                  break
                }
                case "<": {
                  bool = left < right
                  break
                }
                case "<=": {
                  bool = left <= right
                  break
                }
                case "==": {
                  bool = left == right
                  break
                }
                case "===": {
                  bool = left === right
                  break
                }
              }
              if (not) {
                bool = !bool
              }
              if (or) {
                qualified = qualified || bool
              } else {
                qualified = bool
              }
            }
          }
          if (qualified) {
            const right = isNaN(+amount) ? amount : +amount
            for (const { value: left, parent, key } of operate) {
              let nv = left
              if (typeof left === "object") return
              switch (operation) {
                case "x": {
                  nv *= right
                  break
                }
                case "/": {
                  nv /= right
                  break
                }
                case "+": {
                  nv += right
                  break
                }
                case "-": {
                  nv -= right
                  break
                }
                case "%": {
                  nv %= right
                  break
                }
                case "^2": {
                  nv = Math.pow(right, 2)
                  break
                }
                case "=": {
                  nv = right
                  break
                }
              }
              parent[key] = nv
            }
          }
        }
      }
    }
  }
  prepareData() {
    this.data.reset()
    this.prepareBaseData()
    this.applyFeatures({ allowedTargets: [this.type] })
    this.prepareEmbeddedDocuments()
    this.prepareDerivedData()
    this.applyFeatures({ allowedTargets: Object.keys(this.itemTypes) })
  }
}
export class Character extends SystemActor {
  getAttribute(id) {
    const { attributes = {} } = this.model
    return attributes[id]
  }
  static attributeFunctionHash = {}
  static getAttributeFunction(formula) {
    if (typeof formula !== "string") return () => 10
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
    const { attribute: attributes = [] } = this.itemTypes
    for (const item of attributes) {
      const attr = item.model
      const { id } = attr
      scope[id] = attr
    }
    for (const item of attributes) {
      const attr = item.model
      const {
        id,
        increasedLevel = 0,
        formula,
        current,
        costPerPoint = 0,
      } = attr
      const pointsSpent = increasedLevel * costPerPoint
      const level =
        Character.getAttributeFunction(formula)(scope) + increasedLevel
      if (current === undefined) Object.assign(attr, { current: level })
      Object.assign(attr, {
        pointsSpent,
        value: attr.current,
        max: level,
        level,
        item,
      })
    }
    Object.assign(this.model, { attributes: scope })
  }
  prepareBody() {
    const scope = {}
    const { "hit location": hitLocations = [] } = this.itemTypes
    for (const part of hitLocations) {
      scope[part.id] = part
    }
    Object.assign(this.model, { body: scope })
  }
  prepareWeapons() {
    const allWeapons = []
    for (const item of this.items.values()) {
      const weapons = item.getSystemFlag("weapons")
      if (weapons == null) continue
      for (const weapon of weapons) {
        allWeapons.push({
          ...weapon,
          ownerName: item.name,
          ownerUuid: item.uuid,
        })
      }
    }
    Object.assign(this.model, { allWeapons })
  }
  prepareData() {
    super.prepareData(...arguments)
  }
  prepareBaseData() {
    super.prepareBaseData(...arguments)
    this.prepareAttributes()
    this.prepareBody()
    this.prepareWeapons()
  }
  prepareDerivedData() {
    super.prepareDerivedData(...arguments)
    const { points, attributes = {}, body } = this.model
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
    const st = strength?.level ?? 10
    const basicLift = Math.floor((st * st) / 5)
    const encumbranceThresholds = {
      none: basicLift,
      light: basicLift * 2,
      medium: basicLift * 4,
      heavy: basicLift * 6,
      xheavy: basicLift * 8,
    }
    const [encumbranceLevel, penalty] =
      Object.entries(encumbranceThresholds).find(
        ([label, threshold], i, src) => {
          return carriedWeight <= threshold || i === src.length
        }
      ) || []
    const liftingThresholds = {}
    let pointsSpent =
      pointsSpentSkills +
      pointsSpentTechniques +
      pointsSpentTraits +
      pointsSpentPerks +
      pointsSpentQuirks
    for (const [id, attr] of Object.entries(attributes)) {
      pointsSpent += attr.pointsSpent
    }
    const pointSummary = {
      skills: pointsSpentSkills,
      techniques: pointsSpentTechniques,
      traits: pointsSpentTraits,
      perks: pointsSpentPerks,
      quirks: pointsSpentQuirks,
    }
    const unspentPoints = points - pointsSpent
    const progression = DamageProgression.BasicSet
    const swing = progression.calculateSwing(st).toString()
    const thrust = progression.calculateThrust(st).toString()
    Object.assign(this.model, {
      unspentPoints,
      pointsSpent,
      pointSummary,
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

export class Party extends SystemActor {}

export class Template extends SystemActor {}
