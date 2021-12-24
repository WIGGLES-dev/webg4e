import { World } from "ecs";
import { computeEncumbrance, computeFeatureBonus } from "./systems";

export const GURPS = new World()
  .addSystem(computeEncumbrance)
  .addSystem(computeFeatureBonus);
