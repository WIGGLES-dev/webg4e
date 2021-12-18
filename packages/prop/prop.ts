export const get = (src: Record<string, any>, path: string): any => {
  try {
    return path.split(".").reduce((obj, key, i, keys) => {
      if (obj && key in obj) {
        const next: any = obj?.[key];
        return next;
      }
    }, src);
  } catch (err) {
    console.error(err);
  }
};
export const set = (
  src: Record<string, any>,
  path: string,
  value: any
): boolean => {
  try {
    let changed = false;
    path.split(".").reduce((obj, key, i, keys) => {
      if (obj && key in obj) {
        if (i === keys.length - 1) {
          if (obj[key] !== value) {
            obj[key] = value;
            changed = true;
          }
        }
      } else {
        obj[key] = {};
      }
      return obj?.[key];
    }, src);
    return changed;
  } catch (err) {
    console.error(err);
    return false;
  }
};
export const has = (src: Record<string, any>, path: string): boolean => {
  try {
    let hasProperty = false;
    path.split(".").reduce((obj, key, i, keys) => {
      if (i === keys.length - 1) {
        hasProperty = obj && key in obj;
      }
      if (obj && key in obj) {
        const next: any = obj?.[key];
        return next;
      }
    }, src);
    return hasProperty;
  } catch (err) {
    console.error(err);
    return false;
  }
};
