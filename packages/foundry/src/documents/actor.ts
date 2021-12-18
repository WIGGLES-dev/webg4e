import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import { get } from "prop";
import { Store } from "../mixins/document-store";
import { GURPSItem } from "./item";
type GURPSActorTypes = "character" | "party";
type GURPSCharacterData = {
  type: "character";
};
type GURPSPartyData = {
  type: "party";
};
type GURPSActorData = GURPSCharacterData & GURPSPartyData;

export class GURPSActor extends Store(Actor) {
  get type(): GURPSActorTypes {
    return super.type;
  }
  get baseData(): GURPSActorData {
    return this.data.data;
  }
  get items(): EmbeddedCollection<typeof GURPSItem, GURPSItem["data"]> {
    return super.items;
  }
  matchItems(query: Record<string, any>) {
    return [...this.items.values()]
      .filter((item) => {
        return Object.entries(query).every(([path, value]) => {
          if (typeof value === "function") {
            return value(get(item.data, path)) === true;
          }
          return get(item.data, path) === value;
        });
      })
      .sort((a, b) => {
        return a.data.sort - b.data.sort;
      })
      .map((item) => ({
        ...item.data.data,
        type: item.type,
        id: item.id,
      }));
  }
  prepareCharacterData() {
    const data: any = this.baseData;
    const skills = this.matchItems({
      type: (type: string) => ["skill", "technique"].includes(type),
    });
    const spells = this.matchItems({ type: "spell" });
    const advantages = this.matchItems({ type: "advantage" });
    const equipment = this.matchItems({ type: "equipment" });
    const notes = this.matchItems({ type: "note" });
    const gcsData = {
      ...data,
      skills,
      spells,
      advantages,
      equipment,
      other_equipment: [],
      notes,
      id: this.id,
    };
    this.data.data = gcsData;
  }
  preparePartyData() {
    const data: any = this.baseData;
  }
  prepareBaseData() {
    super.prepareBaseData();
    switch (this.type) {
      case "character": {
        this.prepareCharacterData();
      }
      case "party": {
        this.preparePartyData();
      }
    }
  }
}
