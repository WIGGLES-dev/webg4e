import { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import { MergeObjectOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs";
import { Writable } from "svelte/store";

export const Store = <
  T extends new (...args: any[]) => foundry.abstract.Document<any, any>
>(
  Base: T
) => {
  return class StoreMixin
    extends Base
    implements Writable<InstanceType<T>["data"]>
  {
    static #timestamps = new Map<string, number>();
    private subscriptions = new Set<(value: this["data"]) => void>();
    private flagSubscriptions = {} as Record<
      string,
      Record<string, Set<(value: any) => void> | undefined> | undefined
    >;
    constructor(...args: any[]) {
      super(...args);
    }
    protected run() {
      for (const cb of this.subscriptions) {
        cb(this.data.toObject());
      }
    }
    protected runFlag(scope: string, key: string) {
      const value = this.getFlag(scope, key);
      for (const cb of this.flagSubscriptions[scope]?.key ?? []) {
        cb(value);
      }
    }
    async set(value: DeepPartial<this["data"]>) {
      await this.update(value);
      this.run();
    }
    $getFlag<T>(scope: string, key: string) {
      return {
        subscribe: (cb: (value: T) => void) => {
          return this.subscribeFlag(scope, key, cb);
        },
        set: (value: T) => {
          this.setFlag(scope, key, value);
        },
      };
    }
    subscribe(cb: (value: this["data"]) => void) {
      cb(this.data.toObject());
      this.subscriptions.add(cb);
      return () => this.subscriptions.delete(cb);
    }
    subscribeFlag(scope: string, key: string, cb: (value: any) => void) {
      const flagValue = this.getFlag(scope, key);
      const flagSubs = this.flagSubscriptions;
      if (!flagSubs[scope]) flagSubs[scope] = {};
      if (flagSubs[scope]) {
        const scopeSet = this.flagSubscriptions[scope];
        if (scopeSet && !scopeSet[key]) scopeSet[key] = new Set();
        if (flagSubs[scope]?.[key]) {
          cb(flagValue);
          flagSubs[scope]?.[key]?.add(cb);
          return () => {
            this.flagSubscriptions[scope]?.[key]?.delete(cb);
          };
        }
      }
    }
    async update(
      data?: DeepPartial<unknown>,
      context?: DocumentModificationContext & MergeObjectOptions
    ): Promise<this | undefined> {
      const rv = super.update(data, context);
      return rv;
    }
    protected _onUpdate(
      changed: DeepPartial<any>,
      options: DocumentModificationOptions,
      userId: string
    ): void {
      const rv = super._onUpdate(changed, options, userId);
      this.run();
      return rv;
    }
  };
};
