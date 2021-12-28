import { ComponentConstructor, ns } from "ecs";
const comp = ns("gurps");

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
}>("level")({
  default: {
    difficulty: Difficulty.Average,
    points: 0,
  },
});

export const Link = comp<{
  that: Map<ComponentConstructor, Record<string, any>>;
  match?: number;
}>("link")({
  default: { that: new Map() },
});

export const Default = comp<{
  modifier: number;
}>("default")({
  default: { modifier: 0 },
});

export const Encumbrance = comp<{
  amount: number;
  extendedAmount: number;
}>("encumbrance")({
  default: {
    amount: 0,
    extendedAmount: 0,
  },
});

export const Value = comp<number>("value")({ default: 0 });

export const Trait = comp<{
  basePoints: number;
  cost: number;
}>("trait")({
  default: {
    basePoints: 0,
    cost: 0,
  },
});

export const Quantity = comp<number>("quantity")({ default: 0 });

export enum FeatureType {
  LevelBonus,
}
export const Features = comp<
  {
    type: FeatureType;
    amount: number;
  }[]
>("feature")({
  default: [],
});

export const Modifiers = comp<{}[]>("modifier")({
  default: [],
});

export const Host = comp<{
  features: number;
}>("host")({
  default: { features: 0 },
});

export const FeatureBonus = comp<number>("feature bonus")({
  default: 0,
});
