import { World, Hierarchy } from "ecs";
import { computeEncumbrance } from "./systems";

export const GURPS = new World()
  .addSystem(computeEncumbrance)
  .addResource(new Hierarchy());
