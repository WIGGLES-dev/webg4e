export enum AttributeType {
  Integer = "integer",
  Decimal = "decimal",
  Pool = "pool",
}
import type { Character } from "../character/character";
import { Attribute } from "./attribute";
export class AttributeDef {
  type: AttributeType = AttributeType.Integer;
  name = "";
  fullName = "";
  attributeBase = "0";
  order?: number;
  costPerPoint = 0;
  costAdjPercentPerSM = 0;
  thresholds: unknown[] = [];
  color = "red";
  private _expression?: (scope?: Record<string, any>) => number;
  constructor(public id: string) {}
  createAttribute(character: Character): Attribute {
    return new Attribute(this.id);
  }
  get isPrimary() {
    return this.isPool && !this.attributeBase?.startsWith("$");
  }
  get isSecondary() {
    return !this.isPrimary;
  }
  get isPool() {
    return this.type === AttributeType.Pool;
  }
  get combinedName() {
    return this.fullName
      ? `${this.fullName} ${this.name ? `(${this.name})` : ""}`
      : `${this.name}`;
  }
  private static _extractVariables(expression: string) {
    expression = expression.replace(/\+/g, " + ");
    expression = expression.replace(/\-/g, " - ");
    expression = expression.replace(/\//g, " / ");
    expression = expression.replace(/\*/, " * ");
    expression = expression.replace(/\(/g, " ( ");
    expression = expression.replace(/\)/g, " ) ");
    let variables: string[] = [];
    let looping = true;
    let currentIndex = -1;
    while (looping) {
      const nextI = expression.indexOf("$", currentIndex + 1);
      if (nextI === -1) {
        break;
      } else {
        currentIndex = nextI;
        const [variable] = expression.slice(currentIndex).split(" ");
        variables.push(variable);
      }
    }
    return variables;
  }
  private static _compileExpression(expression: string) {
    const variables = AttributeDef._extractVariables(expression);
    const func = new Function(
      ...variables,
      "floor",
      "max",
      "ceil",
      "min",
      "round",
      `return ${expression}`
    );
    return (scope: Record<string, any> = {}): number => {
      try {
        const ret = func(
          ...variables.map((variable) => scope[variable]),
          Math.floor,
          Math.max,
          Math.ceil,
          Math.min,
          Math.round
        ) as number;
        return ret;
      } catch (err) {
        console.error(err);
        return 0;
      }
    };
  }
  getBaseValue(character: Character): number {
    if (this.attributeBase == null) return 0;
    if (this._expression == null) {
      this._expression = AttributeDef._compileExpression(this.attributeBase);
    }
    const values = [...character.settings.attributes.values()]
      .map((def) => {
        if (
          def.id &&
          def.id !== this.id &&
          this.attributeBase?.includes(def.id)
        ) {
          const attribute = character.attributes.get(def.id);
          if (attribute) {
            return [`$${def.id}`, attribute.getCurrentValue(character)];
          }
        }
      })
      .filter((value) => value != null) as [string, number][];
    const scope = Object.fromEntries(values);
    const result = this._expression?.(scope);
    return result;
  }
  computeCost(
    character: Character,
    adjustment: number,
    costReduction: number
  ): number {
    const sm = character.profile.sizeModifier || 0;
    const cost = this.costPerPoint * adjustment;
    return cost;
  }
  saveGcs() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      full_name: this.fullName,
      attribute_base: this.attributeBase,
      cost_per_point: this.costPerPoint,
      cost_adj_percent_per_sm: this.costAdjPercentPerSM,
      thresholds: this.thresholds,
      color: this.color,
    };
  }
  loadGcs(data: any) {
    try {
      const {
        id,
        type,
        name,
        full_name,
        attribute_base,
        cost_per_point,
        cost_adj_percent_per_sm,
        thresholds,
        color,
      } = data;
      if (typeof id === "string") this.id = id;
      if (typeof type === "string") this.type = type as AttributeType;
      if (typeof name === "string") this.name = name;
      if (typeof full_name === "string") this.fullName = full_name;
      if (typeof attribute_base === "string")
        this.attributeBase = attribute_base;
      if (typeof cost_per_point === "number")
        this.costPerPoint = cost_per_point;
      if (typeof cost_adj_percent_per_sm === "number")
        this.costAdjPercentPerSM = cost_adj_percent_per_sm;
      if (thresholds instanceof Array) this.thresholds = thresholds;
      if (typeof color === "string") this.color = color;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
