import { v4 } from "uuid";
export type GConstructor<T> = abstract new (...args: any[]) => T;
export const unique = <T extends GConstructor<any>>(Base: T) => {
  abstract class UniqueMixin extends Base {
    id: string = v4();
    constructor(...args: any[]) {
      super(...args);
    }
  }
  return UniqueMixin;
};
