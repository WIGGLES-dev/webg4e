import { Store } from "./mixins/document-store";
import { DocumentExtension } from "./mixins/document-extension";
import { TemplateData, TemplateItemTypes } from "./system";

export class BaseSystemItem extends Store(Item) {}
const SystemItem = <T extends TemplateItemTypes>(type: T) => {
  class SystemItem extends DocumentExtension(BaseSystemItem) {
    static type = type;
    data!: Item["data"] & { data: TemplateData<"Item", T> };
  }
  return SystemItem;
};

export class Skill extends SystemItem("skill") {}
export class Trait extends SystemItem("trait") {}
export class Equipment extends SystemItem("equipment") {
  eWeight() {
    return this.source.weight * this.source.quantity;
  }
}

declare global {
  interface DocumentClassConfig {
    Item: typeof Skill | typeof Trait | typeof Equipment;
  }
}
