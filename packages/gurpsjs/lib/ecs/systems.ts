import { sys, World, query, changed, added, Entity, View } from "ecs";
import { Lazy } from "lazy-iter";
import {
  Encumbrance,
  Level,
  Feature,
  FeatureBonus,
  Difficulty,
  Host,
  Default,
  FeatureType,
  Link,
} from "./components";

export const computeTraitCost = sys(() => {}, query());

export const computeEncumbrance = sys(
  (world, q1) => {
    for (const [entity, enc] of q1) {
      enc.data.extendedAmount = entity
        .descendants(query(Encumbrance))
        .fold((acc, [encumbrance]) => acc + encumbrance.data.amount, 0);
    }
  },
  World,
  query(Entity, Encumbrance)
);

export const computeRelativeLevel = sys(
  (q1, q2) => {
    for (const [level] of q1.chain(q2)) {
      let { points, difficulty } = level.data;
      let baseLevel: number;
      switch (level.data.difficulty) {
        case Difficulty.Easy:
          baseLevel = 0;
        case Difficulty.Average:
          baseLevel = -1;
        case Difficulty.Hard:
          baseLevel = -2;
        case Difficulty.VeryHard:
          baseLevel = -3;
        case Difficulty.Wildcard:
          baseLevel = -4;
        default:
          baseLevel = 0;
      }
      if ((difficulty = Difficulty.Wildcard)) {
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

export const computeLevel = sys((q1) => {
  for (const [entity, level] of q1) {
    let ancestor = entity.ancestors(query(Entity, Host)).first();
    if (ancestor) {
      const [entity, host] = ancestor;
      const features = entity.descendants(query(Feature));
      const bonus = features
        .filter(([feature]) => feature.data.type === FeatureType.LevelBonus)
        .filter(([feature]) => true)
        .fold((acc, [feature]) => acc + feature.data.amount, 0);
      if (typeof level.data.baseLevel === "number")
        level.data.baseLevel += bonus;
    }
  }
}, query(Entity, Level));

export const findLinks = sys(
  (world, q1) => {
    q1.map(([link]) => {
      const exec = new Lazy(link.data.that.entries());
      const view = exec.map(([symbol]) => symbol);
      const res = world.query(...view);
      const match = res.enumerate().find(([i, comps]) => {
        return false;
      });
    });
  },
  World,
  query(Link)
);
