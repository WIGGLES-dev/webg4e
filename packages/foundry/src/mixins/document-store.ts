import { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import { MergeObjectOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs";
import { Writable } from "svelte/store";
export const Store = <
  T extends abstract new (...args: any[]) => foundry.abstract.Document<any, any>
>(
  Base: T
) => {
  abstract class StoreMixin
    extends Base
    implements Writable<InstanceType<T>["data"]>
  {
    private static timestamps = new Map<string, number>();
    private subscriptions = new Set<(value: this["data"]) => void>();
    private flagSubscriptions = {} as Record<
      string,
      Record<string, Set<(value: any) => void> | undefined> | undefined
    >;
    constructor(...args: any[]) {
      super(...args);
    }
    protected run() {
      this.subscriptions.forEach((cb) => cb(this.data));
      this.runItems();
    }
    protected runItems() {
      //@ts-ignore
      [...(this?.items?.values() ?? [])].forEach((item) => {
        item?.run();
      });
    }
    protected runFlag(scope: string, key: string) {
      const value = this.getFlag(scope, key);
      this.flagSubscriptions[scope]?.[key]?.forEach((cb) => cb(value));
    }
    async set(value: this["data"]) {
      await this.update(value);
      this.run();
    }
    getFlagStore<T>(scope: string, key: string) {
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
      cb(this.data);
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
      data?: DeepPartial<this["data"]> | ((data: this["data"]) => this["data"]),
      context?: DocumentModificationContext & MergeObjectOptions
    ) {
      let rv;
      if (typeof data === "function") {
        rv = await super.update(data(this.data), context);
      } else {
        rv = await super.update(data, context);
      }
      return rv;
    }
    protected _preUpdate(
      changed: DeepPartial<this["data"]>,
      options: DocumentModificationOptions,
      user: BaseUser
    ) {
      const rv = super._preUpdate(changed, options, user);
      if (this.id) {
        StoreMixin.timestamps.set(this.id, Date.now());
      }
      return rv;
    }
    protected _onUpdate(
      changed: DeepPartial<this["data"]>,
      options: DocumentModificationOptions,
      userId: string
    ) {
      const rv = super._onUpdate(changed, options, userId);
      if ("flags" in changed && typeof changed.flags === "object") {
        Object.entries(changed.flags).forEach(([key, value]) => {
          if (typeof value === "object" && value) {
            Object.entries(value).forEach(([key2, value2]) => {
              this.runFlag(key, key2);
            });
          }
        });
      }
      this.run();
      return rv;
    }
    async delete(context?: DocumentModificationContext) {
      const rv = await super.delete(context);
      return rv;
    }
    protected _preDelete(options: DocumentModificationOptions, user: BaseUser) {
      const rv = super._preDelete(options, user);
      return rv;
    }
    protected _onDelete(options: DocumentModificationOptions, userId: string) {
      const rv = super._onDelete(options, userId);
      return rv;
    }
    protected _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: unknown,
      result: unknown,
      options: DocumentModificationOptions,
      userId: string
    ) {
      //@ts-ignore
      const rv = super._onUpdateEmbeddedDocuments(
        embeddedName,
        documents,
        result,
        options,
        userId
      );
      console.log(result);
      this.run();
      return rv;
    }
    protected _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: unknown,
      result: unknown,
      options: DocumentModificationOptions,
      userId: string
    ) {
      //@ts-ignore
      const rv = super._onCreateEmbeddedDocuments(
        embeddedName,
        documents,
        result,
        options,
        userId
      );
      this.run();
      return rv;
    }
    protected _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: unknown,
      result: unknown,
      options: DocumentModificationOptions,
      userId: string
    ) {
      //@ts-ignore
      const rv = super._onDeleteEmbeddedDocuments(
        embeddedName,
        documents,
        result,
        options,
        userId
      );
      this.run();
      return rv;
    }
  }
  return StoreMixin;
};
