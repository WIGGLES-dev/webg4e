export type System = (world: World) => void;

export class World {
  public components = new Map<Function, (Component | undefined)[]>();
  get entities(): Component[][] {
    return [...this.components.values()]
      .map((_, i, componentSource) =>
        componentSource.map((compArray) => compArray[i])
      )
      .map((v) => v.filter((v): v is Component => v != null));
  }
  public resources = new Map<Function, Resource>();
  public systems: System[] = [];
  public size = 0;
  has(id: number, entities: [...typeof Component[]]): boolean {
    return entities.every(
      (constructor) =>
        this.entities[id]?.find(
          (component) => component instanceof constructor
        ) != null
    );
  }
  spawn(...components: Component[]): number {
    for (const component of components) {
      const src = this.components.get(component.constructor) || [];
      src.push(component);
      this.components.set(component.constructor, src);
    }
    return (this.size += 1);
  }
  remove(id: number, ...components: typeof Component[]) {
    for (const [constructor, components] of this.components.entries()) {
      if (components.includes(constructor)) {
        components[id] = undefined;
      }
    }
  }
  addSystem(system: System): this {
    this.systems.push(system);
    return this;
  }
  addResource(resource: Resource): this {
    this.resources.set(resource.constructor, resource);
    return this;
  }
  tick() {
    for (const system of this.systems) {
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
export abstract class Resource {}

const query = <T extends Constructor<Component>[]>(
  ...args: T
): ((world: World) => [number, SystemExtract<T>][]) => {
  return (world) => {
    let id = 0;
    const out: [number, SystemExtract<T>][] = [];
    for (let componentSet of world.entities) {
      componentSet = componentSet.filter((v) => v != null);
      const mappedOut = args.map((constructor) => {
        if (constructor instanceof Component) {
          return componentSet.find(
            (component) => component instanceof constructor
          );
        } else if (constructor instanceof Resource) {
          return world.resources.get(constructor);
        }
      });
      if (!mappedOut.includes(undefined)) {
        out.push(
          ...(mappedOut as SystemExtract<T>[]).map(
            (v): [number, SystemExtract<T>] => [id, v]
          )
        );
      }
      id += 1;
    }
    return out;
  };
};

export const sys = <T extends Constructor<Component>[]>(
  view: [...T],
  run: (view: SystemExtract<T>, id: number) => void
): System => {
  return (world: World) => {
    for (const [id, set] of query(...view)(world)) {
      run(set, id);
    }
  };
};
