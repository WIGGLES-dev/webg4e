<script lang="ts">
  import { onMount } from "svelte";
  import { Character, Item } from "gurpsjs";
  import { GURPSItem } from "./documents/item";
  import { DetailEditor, TailwindProvider } from "sheet";
  export let sheet: ItemSheet & { item: GURPSItem };
  let item = sheet.item;
  let actor = item.actor;
  const modelClass = Character.getConstructor(item.type);
  let model: Item = new modelClass().loadFoundry(item.data);
  const character = actor ? new Character() : undefined;
  $: item.update($model.saveFoundry());
  $: model.set(model.loadFoundry($item));
  $: if (character) character?.loadFoundry($actor);
</script>

<TailwindProvider>
  <div class="m-3">
    <DetailEditor character="{character}" item="{$model}" />
  </div>
</TailwindProvider>
