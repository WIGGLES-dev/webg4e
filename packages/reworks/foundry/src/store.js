import { derived } from "svelte/store"
export function proxyStore(store) {
  const path = []
  function _pathProxy(end) {
    function extract(value, set) {
      let i = 0
      for (const part of path.slice(0, end)) {
        if ((arguments.length > 1, ++i === end && typeof value === "object")) {
          value[part] = set
        }
        value = value?.[part]
      }
      return value
    }
    const set = (value) => {
      rootStore.update((current) => {
        extract(current, value)
        return current
      })
    }
    const update = (cb) => store.update((value) => set(value))
    const subscribe = (cb) => store.subscribe((value) => cb(extract(value)))
    const _delete = () => {}
    const store = {
      set,
      update,
      subscribe,
      delete: _delete,
    }
    return new Proxy(store, {
      get(target, p, receiver) {
        path.push(p)
        _pathProxy(i + 1)
      },
    })
  }
  return _pathProxy(store, 0)
}
export function undoStore(store) {
  const copy = (value) => {
    if (value instanceof Array) return [...value]
    if (typeof value === "object") return { ...value }
    return value
  }
  let ptr = 0
  const history = []
  const undo = (num = 1) => {
    if (ptr - num > 0) {
      ptr -= num
    }
  }
  const redo = (num = 1) => {
    if (ptr + num < history.length) {
      ptr += num
    } else {
      ptr = history.length
    }
  }
  const set = (value) => {
    history.push(copy(value))
    ptr++
    store.set(value)
  }
  const update = (cb) => set(cb(history[ptr]))
  const subscribe = (cb) => cb(history[ptr])

  return {
    undo,
    redo,
    set,
    update,
    subscribe,
  }
}
