type GConstructor<T> = abstract new (...args: any[]) => T;
export const store = <T extends GConstructor<any>>(Base: T) => {
  abstract class StoreComponent extends Base {
    parentStore?: StoreComponent;
    #subscriptions = new Set<(value: this) => void>();
    constructor(...args: any[]) {
      super(...args);
    }
    run() {
      this.#subscriptions.forEach((cb) => cb(this));
      const { parent } = this;
      if (parent) {
        parent.run();
      }
    }
    next(value: any) {
      this.run();
    }
    set(value: any) {
      this.next(value);
    }
    subscribe(cb: (value: this) => void) {
      cb(this);
      this.#subscriptions.add(cb);
      return () => this.#subscriptions.delete(cb);
    }
    update(cb: (value: this) => void) {
      cb(this);
      this.run();
    }
    derive<T extends StoreComponent>(store: T) {
      store.parentStore = store;
      return this as this & { parent: T };
    }
  }
  return StoreComponent;
};
