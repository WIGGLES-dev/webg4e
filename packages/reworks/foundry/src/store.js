export function sub(store, ...path) {
  function extract(valueIn) {
    let valueOut
    for (const segment of path) {
      valueOut = valueIn?.[path]
      valueIn = valueOut
    }
    return valueOut
  }
  function set(value) {
    store.update((current) => {
      let root = current
      for (let i = 0; i < path.length; ++i) {
        if (i === path.length - 1 && path[i] in current) {
          current[path[i]] = value
        } else if (path[i] in current) {
          current = current[path[i]]
        }
        break
      }
      return root
    })
  }
  return {
    subscribe(cb) {
      store.subscribe((value) => cb(extract(value)))
    },
    set(value) {
      set(value)
    },
    update(updater) {
      store.update((value) => set(updater(extract(value))))
    },
  }
}
