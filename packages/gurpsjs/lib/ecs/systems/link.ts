import { comp } from "../world";
import { Entity, ComponentConstructor, sys, World, query } from "ecs";
import { Lazy } from "lazy-iter";
export class Link extends comp<{
  that: Map<ComponentConstructor, Record<string, any>>;
  match?: number;
}>("link") {}

export const findLinks = sys(
  (world, q1) => {
    q1.map(([link]) => {
      const exec = new Lazy(link.data.that.entries());
      const view = exec.map(([ctor]) => ctor.typeId);
      const filter = exec
        .map(([_, filter]) => Object.entries(filter))
        .collect();
      const res = world.query(Entity, ...view);
      const match = res.find(([entity, ...comps]) =>
        comps.every((comp, i) =>
          filter[i].every(([key, value]) => {
            if (comp instanceof Entity) {
              return true;
            } else if (
              typeof comp.data === "object" &&
              comp.data &&
              key in comp.data
            ) {
              //@ts-ignore
              return comp.data[key] === value;
            }
          })
        )
      );
      link.data.match = match ? match[0].id : undefined;
    });
  },
  World,
  query(Link)
);
