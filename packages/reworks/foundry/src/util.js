import { writable, derived } from "svelte/store"
export const SystemDocumentMixin = (Base) =>
  class extends Base {
    constructor(...args) {
      super(...args)
      this.$data = writable(this.data.toObject())
      this.$items = writable([...(this.items?.values() ?? [])])
    }
    *iterEmbeddedEffects() {
      for (const item of this.items.values()) {
        yield* item.effects.values()
      }
    }
    prepareDerivedData() {
      const method = `prepare${this.data.type.toUpperCase()}`
      this[method]?.()
    }
    get source() {
      return this.data._source
    }
    get model() {
      return this.data.data
    }
    subscribe(...args) {
      return this.$data.subscribe(...args)
    }
    $getFlag(scope, key) {
      const flagStore = derived(this.$data, (data) => data.flags[scope]?.[key])
      return {
        subscribe(cb) {
          flagStore.subscribe(cb)
        },
        set(value) {
          this.setFlag(scope, key, value)
        },
        update(updater) {
          const current = this.getFlag(scope, key)
          this.setFlag(scope, key, updater(value))
        },
      }
    }
    set(value) {
      this.update(value)
    }
    notifyData() {
      this.$data.set(this.data.toObject())
    }
    notifyItems() {
      this.$items.set([...(this.items?.values() ?? [])])
    }
    _onUpdate(...args) {
      const rv = super._onUpdate(...args)
      this.notifyData()
      return rv
    }
    _onCreate(...args) {
      const rv = super._onCreate(...args)
      this.parent?.notifyItems()
      return rv
    }
    _onDelete(...args) {
      const rv = super._onDelete(...args)
      this.parent?.notifyItems()
      return rv
    }
  }

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
