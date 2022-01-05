import { svelteApp } from "./mixins/svelte-rendered";
import { GURPSItem } from "./documents/item";
import SvelteSheet from "./ItemSheet.svelte";
export class GURPSItemSheet extends svelteApp(ItemSheet, SvelteSheet) {
  get item() {
    return super.item as GURPSItem;
  }
  getProps(options: Application.RenderOptions = {}) {
    return {
      sheet: this,
    };
  }
  reRender() {}
  constructor(object: Item) {
    super(object);
  }
}
