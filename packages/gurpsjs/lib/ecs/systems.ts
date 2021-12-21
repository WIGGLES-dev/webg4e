import { Hierarchy, sys } from "ecs";
import { Encumbrance, Level } from "./components";

export const computeEncumbrance = sys([Encumbrance], ([encumbrance]) => {});

export const computeSkillLevel = sys(
  [Hierarchy, Level],
  ([hierarchy, level], id) => {}
);
