import { Lazy, empty } from "lazy-iter";

type Constructor<T> = new (...args: any[]) => T;
export type System = (world: World) => void;
export type ViewPart =
  | ComponentConstructor
  | typeof Entity
  | QueryFilter<any>
  | symbol;
export type View = ViewPart[];

class Hierarchy {
  parentToChild: number[] = [];
  childToParent: number[] = [];
}

export class World {
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
    return new Lazy(this.#iter());
  }
  query<T extends View>(...view: T): Lazy<SystemExtract<T>> {
    return this.iter()
      .enumerate()
      .map(([id, comps]) => {
        return view.map((ctor) => {
          if (ctor === Entity) {
            return new Entity(this, id);
          } else if (typeof ctor === "symbol") {
          } else if ("type" in ctor) {
            switch (ctor.type) {
              case Filter.Added: {
              }
              case Filter.Removed: {
              }
              case Filter.Changed: {
              }
            }
          } else {
            return comps.find((comp) => {
              if (comp && "typeId" in ctor) {
                return comp.typeId === ctor.typeId;
              } else {
                return false;
              }
            });
          }
        });
      })
      .filter((view) => !view.includes(undefined)) as Lazy<SystemExtract<T>>;
  }
  spawn(...components: Component[]): Entity {
    const id = (this.#size += 1);
    this.insert(id, components);
    return new Entity(this, id);
  }
  insert(id: number, components: Component[]) {
    for (const component of components) {
      const arr = this.#components.get(component.typeId) || [];
      arr[id] = component;
      this.#components.set(component.typeId, arr);
    }
  }
  remove(id: number, ctors: ComponentConstructor[]) {
    for (const ctor of ctors) {
      const arr = this.#components.get(ctor.typeId);
      if (arr) {
        arr[id] = undefined;
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
  tick(): this {
    for (const system of this.#systems) {
      system(this);
    }
    return this;
  }
}

export enum ComponentState {
  Changed,
}
export interface Marked {
  typeId: Symbol;
}
export interface Component<T = unknown> extends Marked {
  data: T;
}
export type ComponentConstructor<
  T = unknown,
  C extends CompConfig<T> = CompConfig<T>
> = ((data: Partial<T>) => Component<T>) & Marked;
export interface CompConfig<T> {
  description?: string;
  default: T;
}

export const comp = <T, C extends CompConfig<T> = CompConfig<T>>(
  conf: C
): ComponentConstructor<T> => {
  const merge = (data?: T): T => {
    if (typeof data === "object") {
      return {
        ...(conf?.default ?? {}),
        ...data,
      };
    } else if (data instanceof Array) {
      return data;
    }
    return conf.default;
  };
  const typeId = Symbol(conf?.description);
  const constructor: ((data: T) => Component<T>) & Marked = (data) => {
    return {
      typeId,
      data: merge(data),
    };
  };
  constructor.typeId = typeId;
  return constructor as unknown as ComponentConstructor<T>;
};

type QueryFilter<T extends ComponentConstructor> = {
  type: Filter;
  target: T;
};

enum Filter {
  Changed,
  Added,
  Removed,
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

export type SystemExtract<T extends View | QueryFilter<any>> = {
  [P in keyof T]: T[P] extends ComponentConstructor<infer U>
    ? Component<U>
    : T[P] extends typeof Entity
    ? Entity
    : T[P] extends QueryFilter<infer V>
    ? T[P]["type"] extends Filter.Removed
      ? never
      : V extends ComponentConstructor<infer V>
      ? Component<V>
      : null
    : T[P] extends ViewPart
    ? Component
    : never;
};
type Query = View;
export const query = <T extends View>(...view: T): [...T] => {
  return view;
};

export type DependencyInject<T extends any[]> = {
  [P in keyof T]: T[P] extends Query
    ? Lazy<SystemExtract<T[P]>>
    : T[P] extends typeof World
    ? World
    : T[P] extends Constructor<Resource>
    ? InstanceType<T[P]> | undefined
    : never;
};

export const sys = <T extends any[]>(
  run: (...args: DependencyInject<[...T]>) => void,
  ...dependencies: T
) => {
  return (world: World) => {
    const sysArgs = dependencies.map((dep) => {
      if (dep === World) {
        return world;
      } else if (dep instanceof Resource) {
        return world.resources.get(dep.constructor);
      } else if (dep instanceof Array) {
        world.query(...dep);
      }
    }) as DependencyInject<[...T]>;
    run(...sysArgs);
  };
};

export class Entity {
  constructor(private world: World, readonly id: number) {}
  children<T extends Query>(query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
  descendants<T extends Query>(query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
  addChild(...components: Component[]): Entity {
    return this.world.spawn(...components);
  }
  parent<T extends Query>(query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
  ancestors<T extends Query>(query: T): Lazy<SystemExtract<T>> {
    return Lazy.empty();
  }
}

export const ResourceSymbol = Symbol("resource");
export abstract class Resource {
  type = ResourceSymbol;
}
