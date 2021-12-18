export function sortNumerical(descending = false) {
  return (a: number, b: number) => {
    return descending ? b - a : a - b;
  };
}
export function sortAlphebetical(descending = false) {
  return (a: string, b: string) => {
    a = a.trim().toUpperCase();
    b = b.trim().toUpperCase();
    if (a < b) {
      return descending ? 1 : -1;
    }
    if (a > b) {
      return descending ? -1 : 1;
    }
    return 0;
  };
}
export function noSort() {
  return (a: any, b: any) => {
    return 0;
  };
}
export function propSort<T>(prop: keyof T, descending = false) {
  return (a: T, b: T) => {
    const type = typeof a[prop];
    if (type !== typeof b[prop]) {
      throw new Error("cannot sort mismatched types");
    }
    switch (type) {
      case "string": {
        return sortAlphebetical(descending)(
          a[prop] as unknown as string,
          b[prop] as unknown as string
        );
      }
      case "bigint": {
        return noSort()(a[prop], b[prop]);
      }
      case "number": {
        return sortNumerical(descending)(
          a[prop] as unknown as number,
          b[prop] as unknown as number
        );
      }
      case "boolean": {
        return noSort()(a[prop], b[prop]);
      }
      case "function": {
        return noSort()(a[prop], b[prop]);
      }
      case "object": {
        return noSort()(a[prop], b[prop]);
      }
      case "symbol": {
        return noSort()(a[prop], b[prop]);
      }
      case "undefined": {
        return noSort()(a[prop], b[prop]);
      }
    }
  };
}
