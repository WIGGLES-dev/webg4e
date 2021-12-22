import { query, sys } from "ecs";
import { Encumbrance, Level, Feature } from "./components";

export const computeEncumbrance = sys(
  [Encumbrance],
  ([encumbrance], id, world) => {
    const descendants = world.descendants(id, [Encumbrance]);
    const eweight = descendants.fold((acc, [eq]) => acc + eq.weight, 0);
  }
);

export const computeSkillLevel = sys([Level], ([level], id, world) => {
  const features = world.children(id, [Feature]);
});
