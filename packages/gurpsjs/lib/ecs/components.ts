import { comp, ComponentConstructor, View } from "ecs";

export enum Difficulty {
  Easy,
  Average,
  Hard,
  VeryHard,
  Wildcard,
}

export const Level = comp<{
  difficulty: Difficulty;
  baseLevel: number;
  points: number;
}>({
  default: {
    difficulty: Difficulty.Average,
    baseLevel: 0,
    points: 0,
  },
});

export const Link = comp<{
  that: Map<symbol, Record<string, any>>;
  prefer?: ComponentConstructor;
  match?: number;
}>({
  default: { that: new Map() },
});

export const Default = comp<{
  modifier: number;
}>({
  default: { modifier: 0 },
});

export const Encumbrance = comp<{
  amount: number;
  extendedAmount: number;
}>({
  default: {
    amount: 0,
    extendedAmount: 0,
  },
});

export const Value = comp<number>({ default: 0 });

const Trait = comp<{
  basePoints: number;
  cost: number;
}>({
  default: {
    basePoints: 0,
    cost: 0,
  },
});

export const Quantity = comp<number>({ default: 0 });

export enum FeatureType {
  LevelBonus,
}
export const Feature = comp<{
  type: FeatureType;
  amount: number;
}>({
  default: {
    type: FeatureType.LevelBonus,
    amount: 0,
  },
});

export const Host = comp<{
  features: number;
}>({
  default: { features: 0 },
});

export const FeatureBonus = comp<number>({
  default: 0,
});
