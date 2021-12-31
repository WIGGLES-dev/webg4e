import { sys, World, Entity, query } from "ecs";
import { comp } from "../world";

export class Encumbrance extends comp<{
  amount: number;
  extendedAmount?: number;
}>("encumbrance") {}

export class Value extends comp<{
  amount: number;
  extendedAmount?: number;
}>("value") {}

export class Quantity extends comp<number>("quantity") {}

export const computeEncumbrance = sys(
  (world, q1) => {
    for (const [entity, enc] of q1) {
      enc.data.extendedAmount = entity
        .descendants(Encumbrance)
        .fold((acc, [encumbrance]) => acc + encumbrance.data.amount, 0);
    }
  },
  World,
  query(Entity, Encumbrance)
);
