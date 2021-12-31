import { ComponentConstructor } from "./component";
import { View } from "./world";
export type QueryFilter<T extends ComponentConstructor = ComponentConstructor> =
  {
    type: Filter;
    target: T;
  };

export enum Filter {
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

export const query = <T extends View>(...view: T): T => {
  const positions: number[] = view
    .map((v) =>
      "target" in v ? v.target.bitMask : "bitMask" in v ? v.bitMask : null
    )
    .filter((v): v is number => v != null);
  const maskBits: number[] = [];
  for (let i = 0; i < positions.length; ++i) {
    maskBits[positions[i]] = 1;
  }
  const byteString = maskBits.map((bit) => bit || 0).join();
  const mask = parseInt(byteString, 2);
  return view;
};

export class Query<T extends ComponentConstructor[]> {
  ctors: T;
  constructor(...ctors: T) {
    this.ctors = ctors;
  }
  and() {
    return this;
  }
  with<U extends ComponentConstructor[]>(
    this: Query<[...T, ...U]>,
    ...ctors: U
  ) {
    return this;
  }
  changed<U extends ComponentConstructor[]>(
    this: Query<[...T, ...U]>,
    ...ctors: U
  ) {
    return this;
  }
  track<U extends ComponentConstructor[]>(
    this: Query<[...T, ...U]>,
    ...ctors: U
  ) {
    return this;
  }
}
