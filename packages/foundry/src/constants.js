export const SYSTEM_LINKS = [
  "systems/gurps4e/shadow.css",
  "fonts/fontawesome/css/all.min.css",
]

export class Schema {
  static symbols = {
    date: Symbol("date"),
    string: Symbol("string"),
    bool: Symbol("bool"),
    number: Symbol("number"),
    enum: Symbol("enum"),
    foundryUuid: Symbol("foundryuuid"),
  }
  constructor(params) {
    Object.assign(this, params)
  }
  static date() {
    return new Schema({
      type: Schema.symbols.data,
    })
  }
  static string() {
    return new Schema({
      type: Schema.symbols.string,
    })
  }
  static bool() {
    return new Schema({
      type: Schema.symbols.bool,
    })
  }
  static number() {
    return new Schema({
      type: Schema.symbols.number,
    })
  }
  static enum(...values) {
    return new Schema({
      type: Schema.symbols.enum,
    })
  }
  static foundryUuid() {
    return new Schema({
      type: Schema.symbols.foundryUuid,
    })
  }
}

export const schema = {
  Flag: {
    gurps4e: {
      children: [Schema.string()],
      parent: Schema.foundryUuid(),
      desc: Schema.string(),
      pdfreference: Schema.string(),
      created: Schema.date(),
      modified: Schema.date(),
      features: [
        {
          amount: Schema.string(),
          target: Schema.string(),
          operation: Schema.enum("x", "/", "+", "-", "%", "^2", "="),
          leveled: Schema.string(),
          qualifiers: [
            {
              key: Schema.string(),
              or: Schema.bool(),
              property: Schema.string(),
              not: Schema.bool(),
              operator: Schema.enum(
                "startswith",
                "endswith",
                "includes",
                ">",
                ">=",
                "<",
                "<=",
                "==",
                "==="
              ),
              qualifier: Schema.string(),
              sensitive: Schema.bool(),
            },
          ],
        },
      ],
      weapons: [
        {
          damage: Schema.string(),
        },
      ],
    },
  },
  Item: {
    skill: {
      difficulty: Schema.number(),
      rsl: Schema.number(),
      level: Schema.number(),
      points: Schema.number(),
      attr: Schema.string(),
    },
    trait: {
      basePointCost: Schema.number(),
      levels: Schema.number(),
    },
    equipment: {
      quantity: Schema.number(),
      weight: Schema.number(),
      value: Schema.number(),
    },
    attribute: {
      id: Schema.string(),
      type: Schema.enum("integer", "decimal", "pool"),
      name: Schema.string(),
      fullName: Schema.string(),
      formula: Schema.string(),
      costPerPoint: Schema.number(),
      current: Schema.number(),
      increasedLevel: Schema.number(),
      pointsSpent: Schema.number(),
      value: Schema.number(),
      max: Schema.number(),
      level: Schema.number(),
    },
    "hit location": {
      id: Schema.string(),
      choice_name: Schema.string(),
      tableName: Schema.string(),
      slots: Schema.number(),
      hitPenalty: Schema.number(),
      drBonus: Schema.number(),
      description: Schema.number(),
      rollRange: Schema.string(),
    },
    template: {},
  },
  Actor: {
    character: {},
    party: {},
  },
}
