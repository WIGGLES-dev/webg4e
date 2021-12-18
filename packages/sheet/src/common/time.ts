export const time =
  (label: string) => (target: any, propertyKey: any, descriptor: PropertyDescriptor) => {
    const oldMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.time(label);
      const returnValue = oldMethod.apply(this, args);
      console.timeEnd(label);
      return returnValue;
    };
  };
