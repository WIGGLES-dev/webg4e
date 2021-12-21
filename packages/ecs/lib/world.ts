import { Lazy } from "lazy-iter";

export type System = (world: World) => void;

export class World implements IterableIterator<Lazy<Component | undefined>> {
  #components = new Map<Function, (Component | undefined)[]>();
  #currentGenerator = this.#allOf();
  *#allOf() {
    let id = 0;
    function* yieldComponents(
      componentArrays: IterableIterator<(Component | undefined)[]>,
      id: number
    ) {
      for (const array of componentArrays) {
        yield array[id];
      }
    }
    while (id < this.size) {
      yield new Lazy(yieldComponents(this.#components.values(), id));
      id += 1;
    }
  }
  [Symbol.iterator]() {
    return this.#allOf();
  }
  next() {
    return this.#currentGenerator.next();
  }
  get entities(): Lazy<Lazy<Component | undefined>> {
    return new Lazy(this);
  }
  resources = new Map<Function, Resource>();
  #systems: System[] = [];
  #size = 0;
  get size() {
    return this.#size;
  }
  children(parentId: number): Lazy<number> {
    return query([Child])(this)
      .filter(([id, [child]]) => child.parent === parentId)
      .map(([id, [child]]) => id);
  }
  descendants(id: number): Lazy<number> {
    return this.children(id).flatMap((child) => this.descendants(child));
  }
  ancestors(id: number): Lazy<number> {
    return query([Child])(this).flatMap(([id, [child]]) => this.ancestors(id));
  }
  get<T extends Constructor<Component>[]>(
    id: number,
    components: [...T]
  ): SystemExtract<T> | undefined {
    const set = components.map((constructor) =>
      this.entities
        .collect()
        [id].find((component) => component instanceof constructor)
    );
    if (!set.includes(undefined)) {
      return set as SystemExtract<T>;
    }
  }
  has(id: number, entities: [...typeof Component[]]): boolean {
    return entities.every(
      (constructor) =>
        this.entities
          .collect()
          [id]?.find((component) => component instanceof constructor) != null
    );
  }
  spawn(...components: Component[]): number {
    for (const component of components) {
      const src = this.#components.get(component.constructor) || [];
      src.push(component);
      this.#components.set(component.constructor, src);
    }
    return (this.#size += 1);
  }
  remove(id: number, ...components: typeof Component[]) {
    for (const [constructor, components] of this.#components.entries()) {
      if (components.includes(constructor)) {
        components[id] = undefined;
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

type Constructor<T> = new (...args: any[]) => T;
type MaybeConstructor<T> = T extends Constructor<infer U> ? U : never;
type SystemExtract<T extends Constructor<Component>[]> = {
  [P in keyof T]: MaybeConstructor<T[P]>;
};

export abstract class Component {}

export class Child extends Component {
  nextSibling?: number;
  prevSibling?: number;
  constructor(public parent: number) {
    super();
  }
}
export class Parent extends Component {
  children = 0;
  constructor(public firstChild: number) {
    super();
  }
}

export abstract class Resource {}

export const query = <T extends Constructor<Component>[]>(
  view: [...T]
): ((world: World) => Lazy<[number, SystemExtract<T>]>) => {
  return (world) => {
    return world.entities
      .map((components) =>
        view.map((constructor) =>
          components.find((component) => component instanceof constructor)
        )
      )
      .enumerate()
      .filter(([id, set]) => !set.includes(undefined)) as Lazy<
      [number, SystemExtract<T>]
    >;
  };
};

export const sys = <T extends Constructor<Component>[]>(
  view: [...T],
  run: (view: SystemExtract<T>, id: number, world: World) => void
): System => {
  return (world: World) => {
    for (const [id, set] of query(view)(world)) {
      run(set, id, world);
    }
  };
};
