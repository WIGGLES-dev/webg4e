import { Lazy, empty } from "lazy-iter";

type Constructor<T> = new (...args: any[]) => T;
export type System = (world: World) => void;
export type View = (ComponentConstructor | typeof Entity)[];

class Hierarchy {}

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
  spawn(...components: Component[]): number {
    const id = (this.#size += 1);
    this.insert(id, components);
    return id;
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
  tick() {
    for (const system of this.#systems) {
      system(this);
    }
  }
}

export interface Marked {
  typeId: Symbol;
}
export interface Component<T = unknown> extends Marked {
  data: T;
}
export type ComponentConstructor<T = unknown> = ((data: T) => Component<T>) &
  Marked;
interface CompConfig<T> {
  description: string;
  default: Partial<T>;
}
export const comp = <T>(
  conf?: Partial<CompConfig<T>>
): ComponentConstructor<T> => {
  const merge = (data: T): T => {
    if (typeof data === "object") {
      return {
        ...(conf?.default ?? {}),
        ...data,
      };
    } else if (data instanceof Array) {
      return data;
    }
    return data;
  };
  const typeId = Symbol(conf?.description);
  const constructor: ((data: T) => Component<T>) & Marked = (data) => {
    return {
      typeId,
      data: merge(data),
    };
  };
  constructor.typeId = typeId;
  return constructor;
};

type QueryFilter = any;

enum Filter {
  Changed,
  Added,
  Removed,
  Child,
  Descendant,
  Parent,
  Ancestor,
}

export const changed = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Changed,
    targets,
  };
};
export const added = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Added,
    targets,
  };
};
export const removed = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Removed,
    targets,
  };
};
export const child = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Child,
    targets,
  };
};
export const descendant = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Descendant,
    targets,
  };
};
export const parent = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Parent,
    targets,
  };
};
export const ancestor = (...targets: QueryFilter[]): QueryFilter => {
  return {
    type: Filter.Ancestor,
    targets,
  };
};

export type SystemExtract<T extends View> = {
  [P in keyof T]: T[P] extends ComponentConstructor<infer U>
    ? Component<U>
    : T[P] extends typeof Entity
    ? Entity
    : never;
};
type Query = [View, QueryFilter[]?];
export const query = <T extends View>(
  view: [...T],
  filters?: QueryFilter[]
): [T, QueryFilter[]?] => {
  return [view, filters];
};

export type DependencyInject<T extends any[]> = {
  [P in keyof T]: T[P] extends Query
    ? Lazy<SystemExtract<T[P][0]>>
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
    run(
      ...(dependencies.map((dep) => {
        if (dep === World) {
          return world;
        } else if (dep instanceof Resource) {
          return world.resources.get(dep.constructor);
        } else if (dep instanceof Array) {
          const [view, filters] = dep as Query;
          for (const [id, comps] of world.iter().enumerate()) {
          }
        }
      }) as DependencyInject<[...T]>)
    );
  };
};

export const descendants = (id: number) => {};

export const Child = comp<{
  nextSibling?: number;
  prevSibling?: number;
  parent: number;
}>();

export const Parent = comp<{
  children: number;
  firstChild: number;
}>();

export class Entity {
  constructor(private world: World, readonly id: number) {}
}

export const ResourceSymbol = Symbol("resource");
export abstract class Resource {
  type = ResourceSymbol;
}
