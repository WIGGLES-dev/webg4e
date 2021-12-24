export function* empty() {
  return;
}

export class Lazy<T> implements IterableIterator<T> {
  #generator: Generator<T> = this.#allOf();
  constructor(public source: IterableIterator<T>) {}
  static empty() {
    return new Lazy(empty());
  }
  *#allOf() {
    for (let x of this.source) {
      yield x;
    }
  }
  *#take(count: number) {
    for (const x of this.#generator) {
      if (count-- <= 0) return;
      yield x;
    }
  }
  take(count: number) {
    return new Lazy(this.#take(count));
  }
  *#map<O>(cb: (v: T) => O) {
    for (const x of this.#generator) {
      yield cb(x);
    }
  }
  map<O>(cb: (v: T) => O): Lazy<O> {
    return new Lazy(this.#map(cb));
  }
  *#flatten(
    depth = 1
  ): Generator<T extends IterableIterator<infer I> ? I : never> {
    for (const x of this.#generator) {
      if (--depth === 0) return;
      if (typeof (x as any)?.[Symbol.iterator] === "function") {
      } else {
      }
    }
  }
  flatten() {
    return new Lazy(this.#flatten());
  }
  flatMap<O>(cb: (v: T) => IterableIterator<O>): Lazy<O> {
    return this.map(cb).flatten();
  }
  *#filter(cb: (v: T) => boolean) {
    for (const x of this.#generator) {
      if (cb(x)) {
        yield x;
      }
    }
  }
  filter(predicate: (value: T) => unknown): Lazy<T>;
  filter<S extends T>(cb: (v: T) => v is S): Lazy<S> {
    return new Lazy(this.#filter(cb)) as Lazy<S>;
  }
  *#chain<U>(iterable: IterableIterator<U>) {
    for (const x of this.#generator) {
      yield x;
    }
    for (const x of iterable) {
      yield x;
    }
  }
  chain<U>(iterable: IterableIterator<U>): Lazy<T | U> {
    return new Lazy(this.#chain(iterable));
  }
  chainMap<U>(cb: (value: T) => IterableIterator<U>): Lazy<T | U> {
    return this.chain(this.flatMap(cb));
  }
  find(cb: (v: T) => boolean): T | undefined {
    for (const x of this.#generator) {
      if (cb(x)) {
        return x;
      }
    }
  }
  any(cb: (v: T) => boolean): boolean {
    for (const x of this.#generator) {
      if (cb(x)) {
        return true;
      }
    }
    return false;
  }
  includes(value: T): boolean {
    for (const x of this.#generator) {
      if (value === x) {
        return true;
      }
    }
    return false;
  }
  first(): T | undefined {
    return this.#generator.next().value;
  }
  reduce(cb: (previousValue: T, currentValue: T) => T): T {
    let acc: T | undefined;
    for (const x of this.#generator) {
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
    for (const x of this.#generator) {
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
    return [...this.#generator];
  }
  [Symbol.iterator]() {
    return this.#generator;
  }
  next(): IteratorResult<T> {
    return this.#generator.next();
  }
}
