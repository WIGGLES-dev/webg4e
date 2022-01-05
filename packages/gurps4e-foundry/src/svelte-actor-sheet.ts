import { Character, CharacterItems } from "gurpsjs";
import { GURPSActor } from "./documents/actor";
import { GURPSItem } from "./documents/item";
import { removeAllItems } from "./utilities";
import { svelteApp } from "./mixins/svelte-rendered";
import { Sheet } from "sheet";
import SvelteSheet from "./ActorSheet.svelte";
import { upload } from "dom-utils";

const Base = svelteApp(ActorSheet, SvelteSheet);
export class GURPSActorSheet extends Base {
  get actor(): GURPSActor {
    return super.actor as GURPSActor;
  }
  getProps(options: Application.RenderOptions = {}) {
    return {
      sheet: this,
    };
  }
  reRender() {}
  _getHeaderButtons() {
    return [
      {
        label: "Log Actor",
        class: "dev",
        icon: "fas fa-terminal",
        onclick: () => console.log(this.actor),
      },
      {
        label: "Load GCS",
        class: "load",
        icon: "fas fa-upload",
        onclick: async () => {
          try {
            const file = await upload();
            const text = await file.text();
            const data = JSON.parse(text);
            await removeAllItems(this.actor);
            console.log(data);
            const character = new Character();
            character.loadGcs(data);
            const items = character.getAllItems();
            const itemData = items.map((item) => item.saveFoundry());
            await this.actor.createEmbeddedDocuments("Item", itemData);

            await this.actor.update(character.saveFoundry());
          } catch (err) {}
        },
      },
      ...super._getHeaderButtons(),
    ];
  }
}
