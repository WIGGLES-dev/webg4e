import { ComponentConstructor, Component } from "./component";
import { QueryFilter, Filter } from "./query";
import { Resource, Entity, World, Constructor, ViewPart, View } from "./world";
import { Lazy } from "lazy-iter";
export type System = (world: World) => void;
export type SystemExtractOne<T> = T extends
  | ComponentConstructor
  | Constructor<Resource>
  | typeof Entity
  | typeof World
  ? InstanceType<T>
  : T extends QueryFilter<infer V>
  ? T["type"] extends Filter.Removed
    ? null
    : T["type"] extends Filter.Optional
    ? SystemExtractOne<V> | undefined
    : SystemExtractOne<V>
  : T extends ViewPart
  ? Component
  : never;

export type SystemExtract<T extends any[]> = {
  [P in keyof T]: SystemExtractOne<T[P]>;
};

export type DependencyInject<T extends any[]> = {
  [P in keyof T]: T[P] extends View
    ? Lazy<SystemExtract<T[P]>>
    : T[P] extends ViewPart
    ? SystemExtractOne<T[P]>
    : never;
};

export const sys = <T extends (View | ViewPart)[]>(
  run: (...args: DependencyInject<T>) => void,
  ...dependencies: T
) => {
  const system = (world: World) => {
    const sysArgs = dependencies.map((dep) =>
      world.query(...(dep instanceof Array ? dep : [dep]))
    ) as DependencyInject<T>;
    run(...sysArgs);
  };
  system.dependencies = dependencies;
  return system;
};
