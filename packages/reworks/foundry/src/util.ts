import { Readable, Writable, derived } from "svelte/store";

export type AnyDocument = foundry.abstract.Document<any, any> | Actor | Item;
export type DocOrId = AnyDocument | string;

export type FormControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export const bindTo = (uuid: string) => {
  let pending = false;
  return (control: FormControl) => {};
};

export const dragdrop =
  (...args: ConstructorParameters<typeof DragDrop>) =>
  (node: HTMLElement) => {
    const dd = new DragDrop(...args).bind(node);
    return {
      update() {},
      destroy() {},
    };
  };

export const asyncGeneratorToStore = <T>(generator: AsyncGenerator<T>) => {
  const subscriptions = new Set<(value: T) => void>();
  let consumingGenerator = false;
  return {
    subscribe(cb: (value: T | undefined) => void) {
      cb(undefined);
      if (!consumingGenerator) {
        consumingGenerator = true;
        (async () => {
          for await (const value of generator) {
            for (const cb of subscriptions) {
              cb(value);
            }
          }
        })();
      }
      const subscription = () => {};
      subscriptions.add(subscription);
      const unsubscribe = () => {
        subscriptions.delete(subscription);
      };
      unsubscribe.unsubscribe = unsubscribe;
      return unsubscribe;
    },
  };
};

export const asyncGeneratorToArray = async <T>(
  generator: AsyncGenerator<T>
) => {
  const arr = [];
  for await (const v of generator) arr.push(v);
  return arr;
};

export async function* batchDelete(documents: AnyDocument[]) {
  const actorIds = [];
  const itemIds = [];
  const embeddedItems = new Map<string, Item[]>();
  for (const document of documents) {
    if ("type" in document && document.id != null) {
      switch (document.type) {
        case "Actor": {
          actorIds.push(document.id);
          break;
        }
        case "Item": {
          if (document.parent?.id) {
            const set = embeddedItems.get(document.parent.id) || [];
            set.push(document as Item);
            embeddedItems.set(document.parent.id, set);
          } else {
            itemIds.push(document.id);
          }
          break;
        }
      }
    } else {
    }
  }
  yield* await Actor.deleteDocuments(actorIds);
  yield* await Item.deleteDocuments(itemIds);
  for (const items of embeddedItems.values()) {
    const ids = items
      .map((item) => item.id)
      .filter((id): id is string => id != null);
    yield* await Item.deleteDocuments(ids, {
      parent: items[0].parent || undefined,
    });
  }
}

export function* chain<T, U>(first: Iterable<T>, ...iterables: Iterable<U>[]) {
  yield* first;
  for (const iterable of iterables) {
    yield* iterable;
  }
}

/** One or more `Readable`s. */
declare type Stores =
  | Readable<any>
  | [Readable<any>, ...Array<Readable<any>>]
  | Array<Readable<any>>;
/** One or more values from `Readable` stores. */
declare type StoresValues<T> = T extends Readable<infer U>
  ? U
  : {
      [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
    };

export function dedupe<S extends Stores, T>(
  stores: S,
  cmp = (last: StoresValues<S> | undefined, next: StoresValues<S>) =>
    last !== next
): Readable<StoresValues<S>> {
  let last: StoresValues<S> | undefined;
  return {
    subscribe(cb) {
      return derived(stores, (values) => values).subscribe((next) => {
        if (cmp(last, next)) {
          last = next;
          cb(next);
        }
      });
    },
  };
}

export function tuple<T extends any[]>(...args: T) {
  return args;
}
