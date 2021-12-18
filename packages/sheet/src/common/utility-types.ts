export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export type Modify<T, R> = Omit<T, keyof R> & R;
