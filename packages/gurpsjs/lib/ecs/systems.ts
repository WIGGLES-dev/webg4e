import { sys, World, query, changed, Child, Entity } from "ecs";
import {
  Encumbrance,
  Level,
  Feature,
  FeatureBonus,
  Difficulty,
  Host,
  Default,
} from "./components";

const computeEncumbrance = sys(
  (world, q1) => {
    for (const [entity, enc] of q1) {
    }
  },
  World,
  query([Entity, Encumbrance])
);
