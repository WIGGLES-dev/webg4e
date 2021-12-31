import { Lazy } from "lazy-iter";
import { Component, ComponentConstructor, ComponentState } from "./component";
import { Filter, QueryFilter } from "./query";
import { SystemExtract, System } from "./system";
import { Hierarchy } from "./hierarchy";

export type Constructor<T> = new (...args: any[]) => T;

export type ViewPart =
  | ComponentConstructor
  | typeof Entity
  | typeof World
  | QueryFilter;
export type View = ViewPart[];

class Archetype {}

const stages = {
  preUpdate: Symbol("pre update"),
  update: Symbol("update"),
  postUpdate: Symbol("post update"),
  render: Symbol("render"),
  postRender: Symbol("render"),
};

export class World implements Iterable<Lazy<Component | undefined>> {
  static schema = new Map<symbol, ComponentConstructor>();
  #hierarchy = new Hierarchy();
  #components = new Map<Symbol, (Component | undefined)[]>();
  resources = new Map<Function, Resource>();
  #systems: System[] = [];
  #size = 0;
  get size() {
    return this.#size;
  }
  *#iter() {
    let id = 0;
    function* yieldSet(arrs: Iterable<(Component | undefined)[]>, id: number) {
      for (const arr of arrs) {
        yield arr[id];
      }
    }
    while (id < this.#size) {
      const thisId = id++;
      yield new Lazy(() => yieldSet(this.#components.values(), thisId));
    }
  }
  iter() {
    return new Lazy(this);
  }
  [Symbol.iterator]() {
    return this.#iter();
  }

  static fromJSON(json: string): World {
    return new World().load(json);
  }
  #replacer() {
    return (key: string, value: any) => {
      return value[key];
    };
  }
  #reviver() {
    return (key: string, value: any) => {
      return value[key];
    };
  }
  toJSON(): string {
    return JSON.stringify(this.#components, this.#replacer());
  }
  load(json: string): this {
    JSON.parse(json, this.#reviver());
    return this;
  }
  query<T extends View>(...view: T): Lazy<SystemExtract<T>> {
    return this.iter()
      .enumerate()
      .map(([id, comps]) => {
        return view.map((ctor) => {
          if (ctor === Entity) {
            return new Entity(this, id);
          } else if (ctor === World) {
            return this;
          } else if (ctor instanceof Resource) {
            return this.resources.get(ctor.constructor);
          } else {
            let optional = false;
            let comp = comps.find((comp) => {
              if ("type" in ctor) {
                optional = ctor.type === Filter.Optional;
                if (comp && ctor.target.typeId === comp.typeId) {
                  switch (ctor.type) {
                    case Filter.Added: {
                      return comp?.state === ComponentState.Added;
                    }
                    case Filter.Removed: {
                      return comp?.state === ComponentState.Removed;
                    }
                    case Filter.Changed: {
                      return comp?.state === ComponentState.Changed;
                    }
                  }
                }
              } else if (comp && "typeId" in ctor) {
                return (
                  comp.state !== ComponentState.Removed &&
                  comp.typeId === ctor.typeId
                );
              }
              return false;
            });
            if (comp === undefined && optional) {
              return null;
            } else {
              return comp;
            }
          }
        });
      })
      .filter((comps) => !comps.includes(undefined)) as Lazy<SystemExtract<T>>;
  }
  spawn(...components: Component[]): Entity {
    const id = this.#size++;
    this.insert(id, components);
    return new Entity(this, id);
  }
  insert(id: number, components: Component[]) {
    for (const component of components) {
      component.state = ComponentState.Added;
      const arr = this.#components.get(component.typeId) || [];
      arr[id] = component;
      this.#components.set(component.typeId, arr);
    }
  }
  remove(id: number, ctors: ComponentConstructor[]) {
    for (const ctor of ctors) {
      const arr = this.#components.get(ctor.typeId);
      if (arr) {
        const comp = arr[id];
        if (comp) {
          comp.state = ComponentState.Removed;
        }
      }
    }
  }
  addSystems(...systems: System[]): this {
    this.#systems.push(...systems);
    return this;
  }
  addResource(resource: Resource): this {
    this.resources.set(resource.constructor, resource);
    return this;
  }
  addPlugin(plugin: Plugin): this {
    plugin.build(this);
    return this;
  }
  #subscriptions = new Set<() => void>();
  stream<T extends View>(...view: T): WorldStream<T> {
    return {
      subscribe: (cb) => {
        const poll = () => this.query(...view).forEach(cb);
        poll();
        this.#subscriptions.add(poll);
        const unsubscribe = () => {
          this.#subscriptions.delete(poll);
        };
        unsubscribe.unsubscribe = unsubscribe;
        return unsubscribe;
      },
    };
  }
  tick() {
    for (const system of this.#systems) {
      system(this);
    }
    for (const [id, comps] of this.iter().enumerate()) {
      for (const comp of comps) {
        if (comp) {
          if (comp.state === ComponentState.Removed) {
            const compArr = this.#components.get(comp.typeId);
            if (compArr && compArr.length >= id) compArr[id] = undefined;
          }
          comp.state = ComponentState.NoChange;
        }
      }
    }
    for (const f of this.#subscriptions) {
      f();
    }
    return this;
  }
}

interface WorldStream<T extends View> {
  subscribe(
    cb: (v: SystemExtract<T>) => void
  ): (() => void) & { unsubscribe: () => void };
}

export abstract class Plugin {
  abstract build(world: World): void;
}

type BundlePart = ComponentConstructor | QueryFilter;
export type BundleData<T extends BundlePart[]> = {
  [P in keyof T]: T[P] extends ComponentConstructor
    ? InstanceType<T[P]>["data"]
    : T[P] extends QueryFilter
    ? T[P]["type"] extends Filter.Optional
      ? InstanceType<T[P]["target"]>["data"] | undefined
      : never
    : never;
};
export abstract class Bundle {}
export const bundle = <T extends BundlePart[]>(...components: T) => {
  return class extends Bundle {
    components: SystemExtract<T>;
    constructor(...data: BundleData<T>) {
      super();
      this.components = components.map((ctor, i) => {
        if ("type" in ctor) {
          return new ctor.target(data[i]);
        } else {
          return new ctor(data[i]);
        }
      }) as SystemExtract<T>;
    }
  };
};

export class Entity {
  constructor(private world: World, readonly id: number) {}
  children<T extends View>(...query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
  descendants<T extends View>(...query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
  addChild(...components: Component[]): Entity {
    return this.world.spawn(...components);
  }
  parent<T extends View>(...query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
  ancestors<T extends View>(...query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
}

export const ResourceSymbol = Symbol("resource");
export abstract class Resource {
  type = ResourceSymbol;
}
