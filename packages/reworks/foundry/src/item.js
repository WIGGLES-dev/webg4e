import { SystemDocumentMixin } from "./util.js"

export function* iterEmbeddedDescendants(item) {
  if (item.parent) {
    for (const child of iterEmbeddedChildren(item)) {
      yield child
      yield* iterEmbeddedDescendants(child)
    }
  }
}

export function* iterEmbeddedChildren(item) {
  if (this.parent) {
    const children = this.getFlag(game.system.id, "children")
    if (children) {
      for (const id of children) {
        yield this.parent.getEmbeddedDocument("item", id)
      }
    }
  }
}

export function getEmbeddedParent(item) {
  if (item.parent) {
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
export function* iterEmbeddedAncestors(item) {
  if (item.parent) {
    const parent = parent(item)
    if (parent) {
      yield parent
      yield* iterEmbeddedAncestors(parent)
    }
  }
}

/**
 * Add a relationship between two existing embedded documents
 * @param {Item} child
 * @param {Item} parent
 */
export async function addEmbeddedChild(parent, child) {
  if (child.parent.id !== parent.parent.id)
    throw new Error(
      "Attempted to create a relationship between to documents that are not embedded in the same parent"
    )
  const currentParent = getEmbeddedParent(child)
  if (currentParent?.id === parent.id)
    console.warm(
      "Attempted to create a link a child to the same existing parent"
    )
  if (currentParent) {
    const filteredChildren =
      currentParent
        .getFlag(game.stystem.id, "children")
        ?.filter((id) => id !== child.id) ?? null
    await currentParent.setFlag(game.system.id, "children", filteredChildren)
  }
  const newChildren = [
    ...(parent.getFlag(game.system.id, "children") || []),
    child.id,
  ]
  await parent.setFlag(game.system.id, "children", newChildren)
}

export class SystemItem extends SystemDocumentMixin(Item) {
  prepareSkill() {}
  prepareEquipment() {
    const { weight, value, quantity } = this.source.data
    Object.assign(this.source.data, {
      eWeight: weight * quantity,
      eValue: value * quantity,
    })
  }
  prepareTrait() {
    const { basePointCost, levels, leveledPointCost } = this.source.data
    Object.assign(this.source.data, {
      points: basePointCost + levels * leveledPointCost,
    })
  }

  async addFeatures(features) {
    return await this.craeteEmbeddedDocuments("ActiveEffect", features)
  }
  applyActiveEffects() {
    for (const effect of this.effects.values()) {
    }
  }
}
