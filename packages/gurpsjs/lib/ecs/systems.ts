import { query, sys } from "ecs";
import { Encumbrance, Level, Feature } from "./components";

export const computeEncumbrance = sys(
  [Encumbrance],
  ([encumbrance], id, world) => {
    const descendants = world
      .descendants(id)
      .map((id) => world.get(id, [Encumbrance]));
  }
);

export const computeSkillLevel = sys([Level], ([level], id, world) => {
  const features = world.children(id).map((id) => world.get(id, [Feature]));
});
