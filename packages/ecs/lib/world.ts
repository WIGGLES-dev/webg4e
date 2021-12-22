import { Lazy, empty } from "lazy-iter";

export type System = (world: World) => void;
export type View = ComponentConstructor[];

export class World implements IterableIterator<Lazy<Component | undefined>> {
  #components = new Map<Symbol, (Component | undefined)[]>();
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
  addChild(id: number, components: Component[]) {
    let child = this.spawn(...components, Child({ parent: id }));
    let parent = this.get(id, [Parent])?.[0];
    if (parent != null) {
      parent.children += 1;
    } else {
      this.insert(id, [Parent({ firstChild: child, children: 0 })]);
    }
  }
  children<T extends View>(
    parentId: number,
    view: [...T]
  ): Lazy<SystemExtract<T>> {
    return query([Child, ...view])(this)
      .filter(([child]) => child.parent === parentId)
      .map(([child, ...view]) => view) as Lazy<SystemExtract<[...T]>>;
  }
  descendants<T extends View>(
    id: number,
    view: [...T]
  ): Lazy<SystemExtract<T>> {
    return this.children(id, [Entity, ...view])
      .chainMap(([child]) => this.descendants<T>(child, view))
      .map(([entity, ...extract]) => extract) as Lazy<SystemExtract<T>>;
  }
  parent<T extends View>(
    childId: number,
    view: [...T]
  ): SystemExtract<T> | undefined {
    return query([Entity, Child, ...view])(this)
      .find(([entity, child]) => entity === childId)
      ?.slice(2) as SystemExtract<T> | undefined;
  }
  ancestors<T extends View>(id: number, view: [...T]): Lazy<SystemExtract<T>> {
    const parent = this.parent(id, [Entity, ...view]);
    const wrap = parent ? [parent] : [];
    const lazy = new Lazy(wrap[Symbol.iterator]());
    const ancestors = lazy
      .chainMap(([entity]) => this.ancestors<T>(entity, view))
      .map(([entity, ...extract]) => extract) as Lazy<SystemExtract<T>>;
    return ancestors || Lazy.empty();
  }
  get<T extends View>(
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
  has(id: number, entities: View): boolean {
    return entities.every(
      (constructor) =>
        this.entities
          .collect()
          [id]?.find((component) => component instanceof constructor) != null
    );
  }
  spawn(...components: Component[]): number {
    for (const component of components) {
      const src = this.#components.get(component.typeId) || [];
      src.push(component);
      this.#components.set(component.typeId, src);
    }
    return (this.#size += 1);
  }
  insert(id: number, components: Component[]) {
    for (const component of components) {
      let componentArray = this.#components.get(component.typeId) || [];
      componentArray[id] = component;
      this.#components.set(component.typeId, componentArray);
    }
  }
  remove(id: number, ...components: View) {
    for (const [constructor, components] of this.#components.entries()) {
      if (components.map((c) => c?.typeId).includes(constructor)) {
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

export interface Marked {
  typeId: Symbol;
}
export interface Component<T = unknown> extends Marked {
  data: T;
}
export const comp = <T>(
  description?: number | string
): ComponentConstructor<T> => {
  const typeId = Symbol(description);
  const constructor: ((data: T) => Component<T>) & Marked = (data) => {
    return {
      typeId,
      data,
    };
  };
  constructor.typeId = typeId;
  return constructor;
};

export type ComponentConstructor<T = unknown> = ((data: T) => Component<T>) &
  Marked;
export type SystemExtract<T extends ComponentConstructor[]> = {
  [P in keyof T]: T[P] extends ComponentConstructor<infer U>
    ? U
    : T[P] extends Resource
    ? T[P]
    : never;
};

const Child = comp<{
  nextSibling?: number;
  prevSibling?: number;
  parent: number;
}>();

const Parent = comp<{
  children: number;
  firstChild: number;
}>();

const Entity = comp<number>();

export abstract class Resource {}

export const query = <T extends View>(
  view: [...T]
): ((world: World) => Lazy<SystemExtract<T>>) => {
  return (world) => {
    return world.entities
      .enumerate()
      .map(([id, components]) =>
        (view as T).map((constructor) => {
          if (constructor instanceof Entity) {
            return Entity(id);
          } else if (constructor instanceof Resource) {
            return world.resources.get(constructor);
          } else if (constructor.typeId) {
            return components.find(
              (component) => component instanceof constructor
            );
          }
        })
      )
      .filter((set) => !set.includes(undefined)) as Lazy<SystemExtract<T>>;
  };
};

export const sys = <T extends View>(
  view: [...T],
  run: (view: SystemExtract<T>, id: number, world: World) => void
): System => {
  return (world: World) => {
    for (const [entity, ...set] of query([Entity, ...view])(world)) {
      run(set, entity, world);
    }
  };
};
