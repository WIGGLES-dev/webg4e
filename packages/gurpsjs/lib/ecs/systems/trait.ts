import { query, sys } from "ecs";
import { comp } from "../world";

export class Trait extends comp<{ basePoints: number; cost: number }>(
  "trait"
) {}

export const computeTraitCost = sys((q1) => {
  for (const [trait] of q1) {
  }
}, query(Trait));
