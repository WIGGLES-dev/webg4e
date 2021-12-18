import { World } from "./world";

export abstract class Component {
  static typeIds = new Map<Function, symbol>();
  static get typeId() {
    let typeId = Component.typeIds.get(this.constructor);
    if (!typeId) {
      typeId = Symbol(this.constructor.name);
      Component.typeIds.set(this.constructor, typeId);
    }
    return typeId;
  }
  get typeId() {
    return (this.constructor as typeof Component).typeId;
  }
  entityId?: number;
  world?: World;
}
