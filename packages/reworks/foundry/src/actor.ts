import { Store } from "./mixins/document-store";
import { DocumentExtension } from "./mixins/document-extension";
import { iterDescendants } from "./composition";
import { Equipment } from "./item";
import { TemplateData, TemplateActorTypes, TemplateItemTypes } from "./system";

export class BaseSystemActor extends Store(Actor) {
  itemsOfType<T extends TemplateItemTypes>(type: T) {
    this.itemTypes[type] as unknown as TemplateData<"Item", T>[];
  }
  $itemsOfType<T extends TemplateItemTypes>(type: T) {}
}
const SystemActor = <T extends TemplateActorTypes>(type: T) => {
  return class SystemActor extends DocumentExtension(BaseSystemActor) {
    static type = type;
    data!: Actor["data"] & { data: TemplateData<"Actor", T> };
  };
};

enum Encumbrance {
  None,
  Light,
  Medium,
  Heavy,
  XHeavy,
}

export class Character extends SystemActor("character") {
  #carriedWeight = 0;
  get carriedWeight() {
    return this.#carriedWeight;
  }
  getAttribute(attr: string): number {
    return 0;
  }
  get pointSummary() {
    return {};
  }
  async getCarriedWeight() {
    let carriedWeight = 0;
    for (const item of this.data.items.values()) {
      if (item instanceof Equipment) {
        carriedWeight += item.eWeight();
        for await (const document of iterDescendants(item)) {
          if (document instanceof Equipment) {
            carriedWeight += item.eWeight();
          }
        }
      }
    }
    this.#carriedWeight = carriedWeight;
    return carriedWeight;
  }
  basicLift(mode: string) {
    const st = this.getAttribute("strength");
    (st * st) / 5;
  }
  get enumbrance() {
    return Encumbrance.None;
  }
}

export class Party extends SystemActor("party") {}

declare global {
  interface DocumentClassConfig {
    Actor: typeof Character | typeof Party;
  }
}
