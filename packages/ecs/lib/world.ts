import { Lazy, project } from "lazy-iter";

export type Constructor<T> = new (...args: any[]) => T;
export type System = (world: World) => void;
export type ViewPart =
  | ComponentConstructor
  | typeof Entity
  | typeof World
  | QueryFilter<any>
  | symbol;
export type View = ViewPart[];

class Archetype {}

class Hierarchy extends Archetype {
  indexToEntity: number[] = [];
  parentToChild: number[] = [];
  childToParent: number[] = [];
  addChild(parent: number, child: number) {}
  move(from: number, newParent: number) {}
  removeChild(parent: number, child: number, deep = true) {}
}

class Child {}
class Parent {}

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
    function* yieldEntity(
      arrs: IterableIterator<(Component | undefined)[]>,
      id: number
    ) {
      for (const arr of arrs) {
        yield arr[id];
      }
    }
    const arrs = this.#components.values();
    while (id < this.#size) {
      yield new Lazy(yieldEntity(arrs, id++));
    }
  }
  iter() {
    return new Lazy(project(this));
  }
  [Symbol.iterator]() {
    return this.#iter();
  }
  toJSON(): string {
    return "";
  }
  static fromJSON(json: string): World {
    return new World();
  }
  load(json: string) {}
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
              if (typeof ctor === "symbol") {
                return comp?.typeId === ctor;
              } else if ("type" in ctor) {
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
  addSystem(system: System): this {
    this.#systems.push(system);
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
  tick(): this {
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
    return this;
  }
}

export abstract class Plugin {
  abstract build(world: World): void;
}

export abstract class Bundle {}

export enum ComponentState {
  NotAdded,
  NoChange,
  Changed,
  Removed,
  Added,
}
export interface Marked {
  ns: string;
  typeId: symbol;
}
export interface Component<T = unknown> extends Marked {
  state: ComponentState;
  data: T;
}
export interface ComponentConstructor<T = unknown> extends Marked {
  new (data: T): Component<T>;
}

export const ns =
  (ns: string) =>
  <T>(name: string): ComponentConstructor<T> => {
    const typeId = Symbol(name);
    return class {
      static ns = ns;
      ns = ns;
      static typeId = typeId;
      typeId = typeId;
      state = ComponentState.NotAdded;
      constructor(public data: T) {}
      toJSON() {
        return JSON.stringify(this);
      }
    };
  };

type QueryFilter<T extends ComponentConstructor> = {
  type: Filter;
  target: T;
};

enum Filter {
  Changed,
  Added,
  Removed,
  Optional,
}

export const changed = <T extends ComponentConstructor>(target: T) => {
  return {
    type: Filter.Changed as const,
    target,
  };
};
export const added = <T extends ComponentConstructor>(target: T) => {
  return {
    type: Filter.Added as const,
    target,
  };
};
export const removed = <T extends ComponentConstructor>(target: T) => {
  return {
    type: Filter.Removed as const,
    target,
  };
};
export const optional = <T extends ComponentConstructor>(target: T) => {
  return {
    type: Filter.Optional as const,
    target,
  };
};

export const query = <T extends View>(...view: T): [...T] => {
  return view;
};

export type ExtractComponent<T> = T extends ComponentConstructor<infer U>
  ? Component<U>
  : never;

export type SystemExtract<T extends View | QueryFilter<any>> = {
  [P in keyof T]: T[P] extends ComponentConstructor<infer U>
    ? InstanceType<T[P]>
    : T[P] extends typeof Entity
    ? Entity
    : T[P] extends typeof World
    ? World
    : T[P] extends Constructor<Resource>
    ? InstanceType<T[P]> | undefined
    : T[P] extends QueryFilter<infer V>
    ? T[P]["type"] extends Filter.Removed
      ? never
      : T[P]["type"] extends Filter.Optional
      ? ExtractComponent<V> | undefined
      : ExtractComponent<V>
    : T[P] extends ViewPart
    ? Component
    : never;
};

export type DependencyInject<T extends any[]> = {
  [P in keyof T]: T[P] extends View
    ? Lazy<SystemExtract<T[P]>>
    : T[P] extends ViewPart
    ? SystemExtract<[T[P]]>[0]
    : never;
};

export const sys = <T extends (View | ViewPart)[]>(
  run: (...args: DependencyInject<T>) => void,
  ...dependencies: T
) => {
  return (world: World) => {
    const sysArgs = dependencies.map((dep) =>
      world.query(...(dep instanceof Array ? dep : [dep]))
    ) as DependencyInject<T>;
    run(...sysArgs);
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
