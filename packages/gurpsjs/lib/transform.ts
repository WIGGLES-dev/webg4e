type RecordKey = string | number | symbol;
type KeyTransformRule = (key: RecordKey | RegExp) => string | number | symbol;
type ValueTransformRule = (value: unknown) => unknown;
type KeyTransformMap = Map<RecordKey | RegExp, KeyTransformRule>;
type valueTransformMap = Map<RecordKey | RegExp, ValueTransformRule>;
export class Transformer {
  private keyTransformers: KeyTransformMap = new Map();
  private valueTransformer: valueTransformMap = new Map();
  constructor() {}
  addValueTransform(key: RecordKey, rule: ValueTransformRule) {
    this.valueTransformer.set(key, rule);
    return this;
  }
  addKeyTransform(key: RecordKey, rule: KeyTransformRule) {
    this.keyTransformers.set(key, rule);
    return this;
  }

  transform(input: Record<RecordKey, unknown>): Record<RecordKey, unknown> {
    const regexKeyTransformers = [...this.keyTransformers.entries()].filter(
      ([k, v]) => k instanceof RegExp
    ) as [RegExp, KeyTransformRule][];
    const regexValueTransformers = [...this.valueTransformer.entries()].filter(
      ([k, v]) => k instanceof RegExp
    ) as [RegExp, ValueTransformRule][];
    const output: Record<RecordKey, unknown> = {};
    for (const key in input) {
      const value = input[key];
      const tKey = regexKeyTransformers.reduce((key, [regex, rule]) => {
        if (regex.test(key)) {
          return rule(key);
        }
        return key;
      }, key);
      const tValue = regexValueTransformers.reduce((value, [regex, rule]) => {
        if (regex.test(key)) {
          return rule(value);
        }
        return value;
      }, value);
      output[tKey] = tValue;
    }
    return output;
  }
  static snakeToCamel(): string {
    return "";
  }
  static camelToSnake(): string {
    return "";
  }
}

const skillToGcs = new Transformer().addKeyTransform(
  "f",
  Transformer.camelToSnake
);
