import { writable, derived } from "svelte/store"
import { pipe } from "../util.js"
export const StoreDocumentMixin = (Document) =>
  class extends Document {
    constructor(...args) {
      super(...args)
      this.$data = writable()
      this.$items = writable()
      this.$effects = writable()
      this.notifyData()
      this.notifyEmbedded()
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
      const items = [...(this.items?.values() ?? [])].sort(
        (a, b) => a.data.sort - b.data.sort
      )
      const effects = [...(this.effects?.values() ?? [])]
      this.$items.set(items)
      this.$effects.set(effects)
    }
    _onUpdate(...args) {
      const rv = super._onUpdate(...args)
      this.notifyData()
      this.parent?.notifyData()
      this.parent?.notifyEmbedded()
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
export const TreeDocumentMixin = (Document) =>
  class extends Document {
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
            yield this.parent.getEmbeddedDocument("Item", id)
          }
        }
      }
    }
    getEmbeddedParent() {
      if (this.parent) {
        const parent = this.getFlag(game.system.id, "parent")
        if (parent) {
          return this.parent.getEmbeddedDocument("Item", parent)
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
    async addEmbeddedChild(child) {
      if (this.parent == null)
        throw new Error("Cannot create a relationship on a top level document")
      if (child.parent.id !== this.parent.id)
        throw new Error(
          "Attempted to create a relationship between to documents that are not embedded in the same parent"
        )
      const currentParent = child.getEmbeddedParent()
      if (currentParent?.id === this.id)
        throw new Error(
          "Attempted to create a link a child to the same existing parent"
        )
      if (currentParent) {
        const filteredChildren =
          currentParent
            .getFlag(game.system.id, "children")
            ?.filter((id) => id !== child.id) ?? null
        await currentParent.setFlag(
          game.system.id,
          "children",
          filteredChildren
        )
      }
      const newChildren = [
        ...(this.getFlag(game.system.id, "children") || []),
        child.id,
      ]
      await this.setFlag(game.system.id, "children", newChildren)
      await child.setFlag(game.system.id, "parent", this.id)
    }
  }
export const SystemDocumentMixin = (Document) =>
  class extends pipe(StoreDocumentMixin, TreeDocumentMixin)(Document) {
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
    getSystemFlag(key) {
      return this.getFlag(game.system.id, key)
    }
    $getSystemFlag(key) {
      return this.$getFlag(game.system.id, key)
    }
    setSystemFlag(key, value) {
      return this.setFlag(game.system.id, key, value)
    }
    get source() {
      return this.data._source
    }
    get model() {
      return this.source.data
    }
  }
