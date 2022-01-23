import { writable, derived } from "svelte/store"
const pipe =
  (...fns) =>
  (input) => {
    let output
    for (const fn of fns) {
      output = fn(input)
      input = output
    }
    return output
  }
export const StoreDocumentMixin = (Base) =>
  class extends Base {
    constructor(...args) {
      super(...args)
      this.$data = writable(this.data.toObject())
      this.$items = writable([...(this.items?.values() ?? [])])
      this.$effects = writable([...(this.effects?.values() ?? [])])
    }
    subscribe(...args) {
      return this.$data.subscribe(...args)
    }
    $getFlag(scope, key) {
      const flagStore = derived(this.$data, (data) => data.flags[scope]?.[key])
      return {
        subscribe: (cb) => {
          return flagStore.subscribe(cb)
        },
        set: (value) => {
          this.setFlag(scope, key, value)
        },
        update: (updater) => {
          const value = this.getFlag(scope, key)
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
    notifyEmbedded() {
      this.$items.set([...(this.items?.values() ?? [])])
      this.$effects.set([...(this.effects?.values() ?? [])])
    }
    _onUpdate(...args) {
      const rv = super._onUpdate(...args)
      this.notifyData()
      return rv
    }
    _onCreate(...args) {
      const rv = super._onCreate(...args)
      this.parent?.notifyEmbedded()
      return rv
    }
    _onDelete(...args) {
      const rv = super._onDelete(...args)
      this.parent?.notifyEmbedded()
      return rv
    }
  }
export const TreeDocumentMixin = (Base) =>
  class extends Base {
    constructor(...args) {
      super(...args)
    }
    *iterEmbeddedDescendants() {
      if (this.parent) {
        for (const child of this.iterEmbeddedChildren()) {
          yield child
          yield* child.iterEmbeddedDescendants()
        }
      }
    }
    *iterEmbeddedChildren() {
      if (this.parent) {
        const children = this.getFlag(game.system.id, "children")
        if (children) {
          for (const id of children) {
            yield this.parent.getEmbeddedDocument("item", id)
          }
        }
      }
    }
    getEmbeddedParent() {
      if (this.parent) {
        const parent = this.getFlag(game.system.id, "parent")
        if (parent) {
          return this.parent.getEmbeddedDocument("item", id)
        }
      }
    }
    /**
     * Iterate over the ancestors of the local embedded document tree.
     * @param {Item} item
     */
    *iterEmbeddedAncestors() {
      if (this.parent) {
        const parent = this.getEmbeddedParent()
        if (parent) {
          yield parent
          yield* parent.iterEmbeddedAncestors()
        }
      }
    }
    /**
     * Add a relationship between two existing embedded documents
     * @param {Item} child
     * @param {Item} parent
     */
    async addEmbeddedChild(parent, child) {
      if (child.parent.id !== parent.parent.id)
        throw new Error(
          "Attempted to create a relationship between to documents that are not embedded in the same parent"
        )
      const currentParent = getEmbeddedParent(child)
      if (currentParent?.id === parent.id)
        console.warn(
          "Attempted to create a link a child to the same existing parent"
        )
      if (currentParent) {
        const filteredChildren =
          currentParent
            .getFlag(game.stystem.id, "children")
            ?.filter((id) => id !== child.id) ?? null
        await currentParent.setFlag(
          game.system.id,
          "children",
          filteredChildren
        )
      }
      const newChildren = [
        ...(parent.getFlag(game.system.id, "children") || []),
        child.id,
      ]
      await parent.setFlag(game.system.id, "children", newChildren)
    }
  }
export const SystemDocumentMixin = (Base) =>
  class extends pipe(StoreDocumentMixin, TreeDocumentMixin)(Base) {
    get formControls() {
      const templates = game.system.template[this.documentName].templates
      const schema = game.system.template[this.documentName][this.type]
      const controls = {
        ...(schema || {}),
      }
      if (schema && templates) {
        if (schema.templates) {
          for (const template of schema.templates) {
            Object.assign(schema, templates[template] || {})
          }
        }
        Object.assign(controls, schema)
      }
      const expandedControls = {}
    }
    constructor(...args) {
      super(...args)
    }
    *iterEmbeddedEffects() {
      for (const item of this.items.values()) {
        yield* item.effects.values()
      }
    }
    prepareDerivedData() {
      const type = this.data.type
      if (typeof type === "string") {
        const method = `prepare${capitalize(type)}`
        this[method]?.()
      }
    }
    get source() {
      return this.data._source
    }
    get model() {
      return this.source.data
    }
  }

export function filepicker(options) {
  return new Promise((resolve, reject) => {
    const app = new FilePicker({
      ...options,
      callback: (...args) => {
        options?.callback(...args)
        resolve(app)
      },
    })
    app.render(true)
  })
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
