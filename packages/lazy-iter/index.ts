export function* empty() {
  return;
}

export class Lazy<T> implements Iterable<T> {
  constructor(public source: Iterable<T>) {}
  static empty() {
    return new Lazy(empty());
  }
  *#allOf() {
    for (let x of this.source) {
      yield x;
    }
  }
  *#take(count: number) {
    for (const x of this) {
      if (count-- <= 0) return;
      yield x;
    }
  }
  take(count: number) {
    return new Lazy(this.#take(count));
  }
  forEach(cb: (v: T) => void) {}
  *#map<O>(cb: (v: T) => O) {
    for (const x of this) {
      yield cb(x);
    }
  }
  map<O>(cb: (v: T) => O): Lazy<O> {
    return new Lazy(this.#map(cb));
  }
  *#flatten(
    depth = 1
  ): Generator<T extends IterableIterator<infer I> ? I : never> {
    for (const x of this) {
      if (--depth === 0) return;
      if (typeof (x as any)?.[Symbol.iterator] === "function") {
      } else {
      }
    }
  }
  flatten() {
    return new Lazy(this.#flatten());
  }
  flatMap<O>(cb: (v: T) => Iterable<O>): Lazy<O> {
    return this.map(cb).flatten();
  }
  *#filter(cb: (v: T) => boolean) {
    for (const x of this) {
      if (cb(x)) {
        yield x;
      }
    }
  }
  filter(predicate: (value: T) => unknown): Lazy<T>;
  filter<S extends T>(cb: (v: T) => v is S): Lazy<S> {
    return new Lazy(this.#filter(cb)) as Lazy<S>;
  }
  *#chain<U>(iterable: Iterable<U>) {
    for (const x of this) {
      yield x;
    }
    for (const x of iterable) {
      yield x;
    }
  }
  chain<U>(iterable: Iterable<U>): Lazy<T | U> {
    return new Lazy(this.#chain(iterable));
  }
  chainMap<U>(cb: (value: T) => Iterable<U>): Lazy<T | U> {
    return this.chain(this.flatMap(cb));
  }
  find(cb: (v: T) => boolean): T | undefined {
    for (const x of this) {
      if (cb(x)) {
        return x;
      }
    }
  }
  any(cb: (v: T) => boolean): boolean {
    for (const x of this) {
      if (cb(x)) {
        return true;
      }
    }
    return false;
  }
  every(cb: (v: T) => boolean): boolean {
    for (const x of this) {
      if (cb(x) != true) {
        return false;
      }
    }
    return true;
  }
  includes(value: T): boolean {
    for (const x of this) {
      if (value === x) {
        return true;
      }
    }
    return false;
  }
  first(): T | void {
    return this[Symbol.iterator]().next().value;
  }
  reduce(cb: (previousValue: T, currentValue: T) => T): T {
    let acc: T | undefined;
    for (const x of this) {
      if (acc == null) {
        acc = x;
      } else {
        acc = cb(acc, x);
      }
    }
    return acc as T;
  }
  fold<U>(cb: (accumulator: U, currentValue: T) => U, initial: U): U {
    let accumulator = initial;
    for (const x of this) {
      accumulator = cb(accumulator, x);
    }
    return accumulator;
  }
  enumerate(): Lazy<[number, T]> {
    let i = 0;
    return this.map((v) => {
      return [i++, v];
    });
  }
  collect(): T[] {
    return [...this];
  }
  [Symbol.iterator]() {
    return this.#allOf();
  }
}
