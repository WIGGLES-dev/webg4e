import { writable, readable, derived } from "svelte/store"
import { pipe, concat } from "../util.js"
export const StoreDocumentMixin = (Document) =>
  class extends Document {
    constructor(data) {
      super(...arguments)
      this.$src = writable()
      this.$data = writable()
      this.$items = writable()
      this.$effects = writable()
      this.notify()
    }
    prepareData() {
      super.prepareData(...arguments)
    }
    $getFlag(scope, key) {
      const flagStore = derived(this.$src, (data) => data.flags[scope]?.[key])
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
    subscribe(...args) {
      return this.$src.subscribe(...args)
    }
    set(value) {
      return this.update(value)
    }
    async update(data = {}, context = {}) {
      if (typeof data === "function") {
        return await super.update(data(this.data), context)
      } else {
        return await super.update(...arguments)
      }
    }
    notify(parent = false) {
      this.$data?.set(this.data.toObject(false))
      this.$src?.set(this.data.toObject())
      const items = [...(this.items?.values() ?? [])].sort(
        (a, b) => a.data.sort - b.data.sort
      )
      const effects = [...(this.effects?.values() ?? [])]
      for (const document of concat(items, effects)) {
        document?.notify()
      }
      this.$items?.set(items)
      this.$effects?.set(effects)
      if (parent) this.parent?.notify()
    }
    _onUpdate() {
      const rv = super._onUpdate(...arguments)
      this.notify(true)
      return rv
    }
    _onCreate() {
      const rv = super._onCreate(...arguments)
      this.parent?.prepareData()
      this.parent?.notify(true)
      return rv
    }
    _onDelete() {
      const rv = super._onDelete(...arguments)
      this.parent?.notify(true)
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
            const item = this.parent.getEmbeddedDocument("Item", id)
            if (item == null) {
              continue
            }
            yield item
          }
        }
      }
    }
    getEmbeddedParent() {
      if (this.parent) {
        const parent = this.getFlag(game.system.id, "parent")
        if (parent) {
          const item = this.parent.getEmbeddedDocument("Item", parent)
          return item
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
      if (child instanceof foundry.abstract.Document) {
        if (this.parent == null)
          throw new Error(
            "Cannot create a relationship on a top level document"
          )
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
      } else {
        const [createdChild] = await this.parent.createEmbeddedDocuments(
          "Item",
          [
            {
              ...child,
              flags: {
                [game.system.id]: {
                  parent: this.id,
                },
              },
            },
          ]
        )
        const newChildren = [
          ...(this.getFlag(game.system.id, "children") || []),
          createdChild.id,
        ]
        await this.setFlag(game.system.id, "children", newChildren)
      }
    }
  }
export const SystemDocumentMixin = (Document) =>
  class extends pipe(StoreDocumentMixin, TreeDocumentMixin)(Document) {
    constructor(...args) {
      super(...args)
      this.changes = []
      this.ptr = 0
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
      return this.data.data
    }
    get change() {
      return this.changes[this.changes.length - 1]
    }
    undo(count = 1) {}
    redo(count = 1) {}
    _onUpdate(change) {
      this.changes = this.changes || []
      this.changes.push(change)
      this.ptr++
      return super._onUpdate(...arguments)
    }
    _onDelete() {
      const rv = super._onDelete(...arguments)
      if (this.parent) {
        const update = []
        const remove = []
        const parent = this.getEmbeddedParent()
        if (parent) {
          update.push({
            _id: parent.id,
            flags: {
              [game.system.id]: {
                children: parent.data.flags[game.system.id].children.filter(
                  (id) => id !== this.id
                ),
              },
            },
          })
        }
        for (const descendant of this.iterEmbeddedDescendants()) {
          remove.push(descendant.id)
        }
        this.parent
          .deleteEmbeddedDocuments("Item", remove)
          .then(() => this.parent.updateEmbeddedDocuments("Item", update))
      }
      return rv
    }
    _initialize() {
      if (this.parent == null) {
        super._initialize()
      }
    }
    get proxy() {
      const path = []
      const step = (object) => {
        return new Proxy(object, {
          get: (target, p, receiver) => {
            path.push(p)
            return step(target[p])
          },
          set: (target, p, value, receiver) => {
            this.update({
              [path.join(".") + `.${p}`]: value,
            })
          },
        })
      }
      return step(this.toObject())
    }
  }
