import { sys, query, changed, added, Entity, optional } from "ecs";
import { comp } from "../world";
import { FeatureBonus } from "./feature";

export enum Difficulty {
  Easy,
  Average,
  Hard,
  VeryHard,
  Wildcard,
}

export class Default extends comp<{
  modifier: number;
}>("default") {}

export class Level extends comp<{
  difficulty: Difficulty;
  points: number;
  baseLevel?: number;
  level?: number;
}>("level") {
  get test() {
    return "hello" as const;
  }
}

const computeRelativeLevel = sys(
  (q1, q2) => {
    for (const [level] of q1.chain(q2)) {
      let { points, difficulty } = level.data;
      let baseLevel: number;
      switch (difficulty) {
        case Difficulty.Easy:
          baseLevel = 0;
          break;
        case Difficulty.Average:
          baseLevel = -1;
          break;
        case Difficulty.Hard:
          baseLevel = -2;
          break;
        case Difficulty.VeryHard:
          baseLevel = -3;
          break;
        case Difficulty.Wildcard:
          baseLevel = -4;
          break;
        default:
          baseLevel = 0;
      }
      if (difficulty === Difficulty.Wildcard) {
        points /= 3;
      }
      if (points === 1) {
      } else if (points < 4) {
        baseLevel++;
      } else {
        baseLevel += 1 + points / 4;
      }
      level.data.baseLevel = baseLevel;
    }
  },
  query(changed(Level)),
  query(added(Level))
);

const computeLevel = sys((q1) => {
  for (const [entity, level, bonus] of q1) {
    level.data.level = 0;
    level.data.level += level.data.baseLevel || 0;
    if (bonus?.data.type === "level bonus") {
      level.data.level += bonus.data.amount || 0;
    }
  }
}, query(Entity, Level, optional(FeatureBonus)));

export default [computeRelativeLevel, computeLevel];
