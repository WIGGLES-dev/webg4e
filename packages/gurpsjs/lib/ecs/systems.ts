import { sys, World, query, changed, added, optional, Entity, View } from "ecs";
import { Lazy } from "lazy-iter";
import {
  Encumbrance,
  Level,
  Features,
  FeatureBonus,
  Difficulty,
  Host,
  Default,
  FeatureType,
  Link,
  Trait,
} from "./components";

export const computeTraitCost = sys((q1) => {
  for (const [trait] of q1) {
    
  }
}, query(Trait));

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
    for (const [level, link] of q1.chain(q2)) {
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
      if (link?.data.match) {
      }
      level.data.baseLevel = baseLevel;
    }
  },
  query(changed(Level), optional(Link)),
  query(added(Level))
);

export const computeLevel = sys((q1) => {
  for (const [entity, level] of q1) {
    let ancestor = entity.ancestors(query(Entity, Host)).first();
    if (ancestor) {
      const [entity, host] = ancestor;
      const features = entity.descendants(query(Features));
      const bonus = features
        .flatMap(([features]) => features.data)
        .filter((feature) => feature.type === FeatureType.LevelBonus)
        .fold((acc, feature) => acc + feature.amount, 0);
      if (typeof level.data.baseLevel === "number")
        level.data.baseLevel += bonus;
    }
  }
}, query(Entity, Level));

export const findLinks = sys(
  (world, q1) => {
    q1.map(([link]) => {
      const exec = new Lazy(link.data.that.entries());
      const view = exec.map(([ctor]) => ctor.typeId);
      const filter = exec
        .map(([_, filter]) => Object.entries(filter))
        .collect();
      const res = world.query(Entity, ...view);
      const match = res.find(([entity, ...comps]) =>
        comps.every((comp, i) =>
          filter[i].every(([key, value]) => {
            if (comp instanceof Entity) {
              return true;
            } else if (
              typeof comp.data === "object" &&
              comp.data &&
              key in comp.data
            ) {
              //@ts-ignore
              return comp.data[key] === value;
            }
          })
        )
      );
      link.data.match = match ? match[0].id : undefined;
    });
  },
  World,
  query(Link)
);
