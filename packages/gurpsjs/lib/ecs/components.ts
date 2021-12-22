import { comp } from "ecs";

enum Difficulty {
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
}>();

export const Default = comp();

export const Encumbrance = comp<number>();

export const Value = comp<number>();

export const Quantity = comp<number>();

enum FeatureType {}
export const Feature = comp<{
  type: FeatureType;
  amount: number;
}>();
