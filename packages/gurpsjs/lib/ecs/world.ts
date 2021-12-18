import { Component } from "./component";
import { System } from "./system";
import { Hierarchy } from "./hierarchy";
type ComponentArray = (Component | undefined)[];
type ComponentCollection = {
  [key: symbol]: ComponentArray | undefined;
};
interface WorldData {}
type Constructor<T = {}> = new (...args: any[]) => T;
type MaybeConstructor<T> = T extends Constructor<infer U> ? U : never;
type Query<C extends Constructor<Component> = Constructor<Component>> = {
  component: C;
};
export type IteratorInput = Constructor<Component> | Query;
export type IteratorResults<T extends IteratorInput[]> = {
  [P in keyof T]: MaybeConstructor<
    T[P] extends Query ? T[P]["component"] : T[P]
  >;
};

export class World<T extends WorldData = WorldData> {
  #hierarchy = new Hierarchy();
  #components: ComponentCollection = {};
  #systems: System[] = [];
  #size = 0;
  get size() {
    return this.#size;
  }
  #changed = new Map<symbol, number[]>();
  #added = new Map<symbol, number[]>();
  #removed = new Map<symbol, number[]>();
  #tick() {
    this.#changed.clear();
    this.#added.clear();
    this.#removed.clear();
  }
  constructor() {}
  getComponentCollection(typeId: symbol) {
    let compArray = this.#components[typeId];
    if (!compArray) compArray = this.#components[typeId] = [] as ComponentArray;
    return compArray;
  }
  get allComponentCollections(): Component[][] {
    return Object.values(this.#components);
  }
  /**
   * Creates entities with the given components and returns their ids
   * @param entities
   */
  create(entities: Component[][]): number[] {
    return entities.map((components) => {
      const id = this.#size++;
      this.addComponent(id, components);
      return id;
    });
  }
  /**
   * Deletes entities from the world
   * @param ids Integer ID of entity
   */
  delete(ids: number[]) {
    for (const typeId in this.#components) {
      for (const id of ids) {
        //@ts-ignore
        this.#components[typeId][id] = undefined;
      }
    }
  }
  /**
   * Adds given components to an entity, if they already exist they are replaced
   * @param id Integer ID of entity
   * @param components Components to add to entity
   */
  addComponent(id: number, components: Component[]) {
    for (const component of components) {
      const typeId = component.typeId;
      this.getComponentCollection(typeId)[id] = component;
    }
  }
  removeComponent(id: number, components: symbol[]) {
    for (const typeId of components) {
      this.getComponentCollection(typeId)[id] = undefined;
    }
  }
  run(system: Constructor<System>) {
    new system(this).run();
  }
}
