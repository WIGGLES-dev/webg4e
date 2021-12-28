import { Plugin, World } from "ecs";
import {
  computeEncumbrance,
  computeRelativeLevel,
  computeLevel,
  findLinks,
} from "./systems";

export class GURPSPlugin extends Plugin {
  build(world: World) {
    world
      .addSystem(computeEncumbrance)
      .addSystem(computeRelativeLevel)
      .addSystem(computeLevel)
      .addSystem(findLinks);
  }
}
