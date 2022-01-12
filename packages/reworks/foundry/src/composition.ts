import { AnyDocument, asyncGeneratorToArray, DocOrId, dedupe } from "./util";
import { writable, derived, Readable, Writable } from "svelte/store";

export interface IterConfig {
  cursor?: number;
  embedded?: boolean;
}

export interface CompositionContext<T extends AnyDocument = AnyDocument> {
  cursor: number;
  document: T;
  parent?: AnyDocument;
}

const dirty = writable<Record<string, boolean>>({});
function setDirty(...docsOrIds: DocOrId[]) {
  dirty.update((store) => {
    const next = { ...store };
    for (const docOrId of docsOrIds) {
      next[extractId(docOrId)] = true;
    }
    return next;
  });
}

export function $descendants(docOrId: DocOrId, conf?: IterConfig) {
  return derived(
    dirty,
    (dirty, set) => {
      asyncGeneratorToArray(iterDescendants(docOrId, conf)).then(
        (descendants) => {
          set(descendants);
        }
      );
    },
    [] as CompositionContext[]
  );
}
export function $ancestors(docOrId: DocOrId, conf?: IterConfig) {
  return derived(
    dirty,
    (dirty, set) => {
      asyncGeneratorToArray(iterAncestors(docOrId, conf)).then((ancestors) => {
        set(ancestors);
      });
    },
    [] as CompositionContext[]
  );
}
export function $parent(docOrId: DocOrId) {
  return derived(
    dedupe(dirty, (last, next) => {
      return next[extractId(docOrId)];
    }),
    (dirty, set) => {
      dirty[extractId(docOrId)] = false;
      getParent(docOrId).then((v) => {
        if (v != null) set(v);
      });
    },
    undefined as AnyDocument | undefined
  );
}
export function $children(docOrId: DocOrId, conf?: IterConfig) {
  return derived(
    dedupe(dirty, (last, next) => {
      return next?.[extractId(docOrId)];
    }),
    (dirty, set) => {
      dirty[extractId(docOrId)] = false;
      asyncGeneratorToArray(iterChildren(docOrId, conf)).then(set);
    },
    [] as CompositionContext[]
  );
}

export const h = {
  getChildren(document: AnyDocument): string[] | null {
    return document.data.data.childrenIds || null;
  },
  async setChildren(document: AnyDocument, children: string[] | null) {
    return await document.update({
      data: {
        childrenIds: children,
      },
    });
  },
  getParent(document: AnyDocument): string | null {
    return document.data.data.parentId || null;
  },
  async setParent(document: AnyDocument, parent: string | null) {
    return await document.update({
      data: { parentId: parent },
    });
  },
};

export async function getDocument(
  docOrId: DocOrId
): Promise<AnyDocument | null> {
  if (typeof docOrId === "string") {
    if (docOrId.includes(".")) {
      return await fromUuid(docOrId);
    } else {
      return getDocumentSync(docOrId);
    }
  } else {
    return docOrId;
  }
}
export function getDocumentSync(docOrId: DocOrId): AnyDocument | null {
  return null;
}

export function extractId(docOrId: DocOrId): string {
  const id =
    typeof docOrId === "string"
      ? docOrId
      : "uuid" in docOrId
      ? docOrId.uuid
      : docOrId.id;
  if (id == null) throw new Error();
  return id;
}

export async function getParent(docOrId: DocOrId) {
  const entity = await getDocument(docOrId);
  if (entity == null || entity.id == null) return;
  const parentId = h.getParent(entity);
  if (parentId == null) return;
  const parentDocument = await getDocument(parentId);
  if (parentDocument == null) return;
  return parentDocument;
}

export async function* iterChildren(docOrId: DocOrId, conf: IterConfig = {}) {
  const { cursor = 0 } = conf;
  const entity = await getDocument(docOrId);
  if (entity == null) return;
  const children = h.getChildren(entity);
  if (children instanceof Array) {
    for (const child of children) {
      if (typeof child === "string") {
        const childDocument = await getDocument(child);
        if (!childDocument) return;
        yield {
          cursor: cursor + 1,
          parent: entity,
          document: childDocument,
        };
      }
    }
  }
}
export async function* iterDescendants(
  docOrId: DocOrId,
  conf: IterConfig = {}
): AsyncGenerator<CompositionContext & { parent: AnyDocument }> {
  const { cursor = 0, embedded = false } = conf;
  const entity = await getDocument(docOrId);
  if (entity == null || entity.id == null) return;
  if (embedded && "items" in entity) {
    for (const item of entity.items.values()) {
      if (item.id != null) {
        yield {
          ...conf,
          parent: entity,
          cursor,
          document: item,
        };
        yield* await iterDescendants(item, {
          ...conf,
          cursor: cursor + 1,
        });
      }
    }
  } else {
    for await (const child of iterChildren(entity.id)) {
      const isEmbedded = child.document.parent.id === entity.id;
      const shouldYield = embedded ? isEmbedded : true;
      if (shouldYield) {
        yield child;
        yield* await iterDescendants(child.document, {
          ...conf,
          cursor: cursor + 1,
        });
      }
    }
  }
}
export async function* iterAncestors(
  docOrId: DocOrId,
  conf: IterConfig = {}
): AsyncGenerator<CompositionContext> {
  const entity = await getDocument(docOrId);
  const { cursor = 0, embedded = false } = conf;
  if (entity == null || entity.id == null) return;
  const parent = await getParent(entity.id);
  if (parent == null) return;
  const isEmbedded = entity.parent.id == parent.id;
  const shouldYield = embedded ? isEmbedded : true;
  yield { document: parent, cursor: cursor };
  yield* iterAncestors(parent, { cursor: cursor - 1 });
}

export async function addChild(childDocOrId: DocOrId, parentDocOrId: DocOrId) {
  const child = await getDocument(childDocOrId);
  if (child != null && child.id != null) {
    const parent = await getDocument(parentDocOrId);
    if (parent != null && parent.id != null) {
      const newChildrenIds = [...(h.getChildren(parent) || []), child.id];
      await h.setChildren(parent, newChildrenIds);
      await h.setParent(child, parent.id);
      setDirty(child, parent);
    }
  }
}
export async function removeChild(
  childDocOrId: DocOrId,
  parentDocOrId?: DocOrId,
  remove = false
) {
  const child = await getDocument(childDocOrId);
  if (child != null) {
    const parent = parentDocOrId
      ? await getDocument(parentDocOrId)
      : await getParent(childDocOrId);
    if (parent != null) {
      const childrenIds: string[] =
        h.getChildren(parent)?.filter((id: string) => id !== child.id) ?? [];
      if (remove) {
        for await (const { document } of iterDescendants(parent)) {
          await document.delete();
        }
        await child.delete();
      }
      await h.setChildren(parent, childrenIds);
      if (!remove) {
        await h.setParent(child, null);
      }
      setDirty(childDocOrId, parent);
    }
  }
}
export async function liftChild(
  childDocOrId: DocOrId,
  parentDocOrId?: DocOrId
) {
  const child = await getDocument(childDocOrId);
  if (child != null && child.id != null) {
    const parent = parentDocOrId
      ? await getDocument(childDocOrId)
      : await getParent(childDocOrId);
    if (parent != null && parent.id != null) {
      const newParent = await getParent(parent);
      if (newParent != null && newParent.id != null) {
        await removeChild(parent, child);
        await addChild(child, newParent);
      }
      setDirty(child, parent);
    }
  }
}
export async function moveChild(childDocOrId: DocOrId, parentDocOrId: DocOrId) {
  const child = await getDocument(childDocOrId);
  if (child != null && child.id != null) {
    const parent = await getDocument(childDocOrId);
    if (parent != null && parent.id != null) {
      await removeChild(child);
      await addChild(child, parent);
      setDirty(child, parent);
    }
  }
}
