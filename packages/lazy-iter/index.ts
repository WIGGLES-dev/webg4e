function* empty() {
  return;
}

type GeneratorFunction<T> = (...args: any[]) => Generator<T>;

export function project<T>(iterable: Iterable<T>) {
  return function* () {
    yield* iterable;
  };
}

function take<T>(gf: GeneratorFunction<T>, count: number) {
  return function* (...args: any[]) {
    for (const x of gf(...args)) {
      if (count-- <= 0) return;
      yield x;
    }
  };
}

function flat<T>(
  gf: GeneratorFunction<T>,
  depth = 1
): GeneratorFunction<T extends IterableIterator<infer I> ? I : never> {
  return function* (...args: any[]) {
    for (const x of gf(...args)) {
      if (--depth === 0) return;
      if (typeof (x as any)?.[Symbol.iterator] === "function") {
      } else {
      }
    }
  };
}

function map<T, U>(gf: GeneratorFunction<T>, cb: (v: T) => U) {
  return function* (...args: any[]) {
    for (const x of gf(...args)) {
      yield cb(x);
    }
  };
}

function filter<T>(gf: GeneratorFunction<T>, cb: (v: T) => boolean) {
  return function* (...args: any[]) {
    for (const x of gf(...args)) {
      if (cb(x)) {
        yield x;
      }
    }
  };
}

function chain<T, U>(gf: GeneratorFunction<T>, ...gfs: GeneratorFunction<U>[]) {
  return function* (...args: any[]) {
    for (const x of gf(...args)) {
      yield x;
    }
    for (const gf of gfs) {
      yield* gf(...args);
    }
  };
}

export class Lazy<T> implements Iterable<T> {
  #gf: GeneratorFunction<T>;
  constructor(source: Iterable<T> | GeneratorFunction<T>) {
    if (typeof source === "function") {
      this.#gf = source;
    } else {
      this.#gf = project(source);
    }
  }
  static empty() {
    return new Lazy(empty());
  }
  take(count: number) {
    return new Lazy(take(this.#gf, count));
  }
  forEach(cb: (v: T) => void) {
    for (const x of this) {
      cb(x);
    }
  }
  map<O>(cb: (v: T) => O): Lazy<O> {
    return new Lazy(map(this.#gf, cb));
  }
  flatten() {
    return new Lazy(flat(this.#gf));
  }
  flatMap<O>(cb: (v: T) => Iterable<O>): Lazy<O> {
    return this.map(cb).flatten();
  }
  tap(cb: (value: T) => void): this {
    this.forEach(cb);
    return this;
  }
  filter(predicate: (value: T) => unknown): Lazy<T>;
  filter<S extends T>(cb: (v: T) => v is S): Lazy<S> {
    return new Lazy(filter(this.#gf, cb)) as Lazy<S>;
  }
  chain<U>(...iterables: Iterable<U>[]): Lazy<T | U> {
    return new Lazy(chain(this.#gf, ...iterables.map(project)));
  }
  chainMap<U>(cb: (value: T) => Iterable<U>): Lazy<T | U> {
    return this.chain(this.flatMap(cb));
  }
  find(cb: (v: T) => boolean): T | void {
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
  /**
   * Collects the lazy into an array [...]
   * @returns An array of the lazy values results
   */
  collect(): T[] {
    return [...this];
  }
  [Symbol.iterator]() {
    return this.#gf();
  }
}
