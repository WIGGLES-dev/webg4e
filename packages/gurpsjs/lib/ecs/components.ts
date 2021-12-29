import { ComponentConstructor, ns } from "ecs";
const comp = ns("gurps");

export enum Difficulty {
  Easy,
  Average,
  Hard,
  VeryHard,
  Wildcard,
}

export class Level extends comp<{
  difficulty: Difficulty;
  baseLevel?: number;
  points: number;
}>("level") {}

export class Link extends comp<{
  that: Map<ComponentConstructor, Record<string, any>>;
  match?: number;
}>("link") {}

export class Default extends comp<{
  modifier: number;
}>("default") {}

export class Encumbrance extends comp<{
  amount: number;
  extendedAmount: number;
}>("encumbrance") {}

export class Value extends comp<number>("value") {}

export class Trait extends comp<{ basePoints: number; cost: number }>(
  "trait"
) {}

export class Quantity extends comp<number>("quantity") {}

export enum FeatureType {
  LevelBonus,
}
export class Features extends comp<
  {
    type: FeatureType;
    amount: number;
  }[]
>("feature") {}

export class Modifiers extends comp<{}[]>("modifier") {}

export class Host extends comp<{ feature: number }>("host") {}

export class FeatureBonus extends comp<number>("feature bonus") {}
