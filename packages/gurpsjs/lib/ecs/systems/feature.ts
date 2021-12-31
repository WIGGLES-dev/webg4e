import { sys } from "ecs";
import { comp } from "../world";

export interface Feature {
  ns?: string;
  type: string;
  amount: number;
}
export class Features extends comp<Feature[]>("feature") {}

export class Modifiers extends comp<Array<{}>>("modifier") {}

export class FeatureBonus extends comp<{ type: string; amount?: number }>(
  "feature bonus"
) {}

/**
 * Plays host to all child ancestors. Features only share state betweeen their most recent ancestor host and hosts cannot have descendants that are also hosts.
 */
export class Host extends comp<{ features: number }>("host") {}

export const sumFeatures = sys(() => {}, FeatureBonus);
