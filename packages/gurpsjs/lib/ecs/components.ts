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
  baseLevel?: number;
  points: number;
}>({
  default: {
    baseLevel: 0,
  },
});

export const Default = comp<{
  to: View;
  that: Record<string, any>;
  prefer: ComponentConstructor;
  modifier: number;
}>();

export const Encumbrance = comp<{
  amount: number;
  extendedAmount: number;
}>();

export const Value = comp<number>();

export const Quantity = comp<number>();

export enum FeatureType {}
export const Feature = comp<{
  type: FeatureType;
  amount: number;
}>();

export const Host = comp<{
  features: number;
}>();

export const FeatureBonus = comp<number>();
