import {
  iterAncestors,
  iterChildren,
  iterDescendants,
  getParent,
  IterConfig,
  $descendants,
  $ancestors,
  $children,
  $parent,
} from "../composition";
import { AnyDocumentData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs";

export const DocumentExtension = <
  T extends new (...args: any[]) => foundry.abstract.Document<
    AnyDocumentData & { data: any }
  >
>(
  Base: T
) => {
  return class DocumentExtension extends Base {
    get source(): this["data"]["data"] {
      return this.data.data;
    }
    async *descendants(conf?: IterConfig) {
      yield* await iterDescendants(this, conf);
    }
    $descendants(conf?: IterConfig) {
      return $descendants(this, conf);
    }
    async *ancestors(conf?: IterConfig) {
      yield* await iterAncestors(this, conf);
    }
    $ancestors(conf?: IterConfig) {
      return $ancestors(this, conf);
    }
    async *children(conf?: IterConfig) {
      yield* await iterChildren(this, conf);
    }
    $children(conf?: IterConfig) {
      return $children(this, conf);
    }
    async getParent() {
      await getParent(this);
    }
    $parent() {
      return $parent(this);
    }
  };
};
