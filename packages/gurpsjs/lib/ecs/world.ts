import { World } from "ecs";
import {
  computeEncumbrance,
  computeRelativeLevel,
  computeLevel,
  findLinks,
} from "./systems";

import { Level, Difficulty } from "./components";

export const GURPS = new World()
  .addSystem(findLinks)
  .addSystem(computeEncumbrance)
  .addSystem(computeRelativeLevel)
  .addSystem(computeLevel);

GURPS.spawn(
  Level({
    difficulty: Difficulty.Hard,
    points: 0,
  })
);

GURPS.tick();
