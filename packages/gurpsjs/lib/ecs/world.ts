import { ns, Plugin, World } from "ecs";
export const comp = ns("gurps");

import LevelSystems from "./systems/level";
import { findLinks } from "./systems/link";
import { computeEncumbrance } from "./systems/item";

export class GURPSPlugin extends Plugin {
  build(world: World) {
    world
      .addSystems(findLinks)
      .addSystems(computeEncumbrance)
      .addSystems(...LevelSystems);
  }
}
