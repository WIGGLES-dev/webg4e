export enum ComponentState {
  NotAdded,
  NoChange,
  Changed,
  Removed,
  Added,
}

export interface Marked {
  readonly ns: string;
  readonly typeId: symbol;
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export interface Component<T = unknown> extends Marked {
  state: ComponentState;
  readonly data: T;
}

export interface ComponentConstructor<T = unknown> extends Marked {
  readonly readonly: boolean;
  readonly bitMask: number;
  new (data: T): Component<T>;
}

let compCount = 0;
export const ns =
  (ns: string) =>
  <T>(name: string): ComponentConstructor<T> => {
    const bitMask = compCount++;
    const typeId = Symbol(name);
    return class {
      static readonly readonly: boolean = false;
      static readonly bitMask = bitMask;
      static readonly ns = ns;
      readonly ns = ns;
      static readonly typeId = typeId;
      readonly typeId = typeId;
      state = ComponentState.NotAdded;
      constructor(public readonly data: T) {}
      toJSON() {
        return JSON.stringify(this);
      }
    };
  };
