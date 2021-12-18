import { Component } from "./component";
import { World } from "./world";
export class Query<T> {
  #changed: typeof Component[] = [];
  #removed: typeof Component[] = [];
  #with: typeof Component[] = [];

  constructor() {}

  changed(...args: typeof Component[]) {
    this.#changed.push(...args);
  }
  removed(...args: typeof Component[]) {
    this.#removed.push(...args);
  }
  with(...args: typeof Component[]) {
    this.#with.push(...args);
  }

  extract(world: World) {
    this.#with
      .reduce((idList, type) => {
        let collection = world.getComponentCollection(type.typeId);
        return [...idList, ...collection.map((comp, i) => (comp ? i : null))];
      }, [])
      .filter((id, i, idList) => typeof id === "number" && !idList.includes(id))
      .filter((id) => {});
  }
}
