<script lang="ts">
  import { onMount } from "svelte";
  import {
    Character,
    CharacterItems,
    Item,
    Skill,
    Advantage,
    Equipment,
    Spell,
    Technique,
    Note,
  } from "gurpsjs";
  import { GURPSItem } from "./documents/item";
  import { DetailEditor, TailwindProvider } from "sheet";
  export let sheet: ItemSheet & { item: GURPSItem };
  let item = sheet.item;
  let actor = item.actor;
  const modelClass = getModel(item.type);
  let model: Item = new modelClass().loadFoundry(item.data);
  const character = actor ? new Character() : undefined;
  function getModel(type: string) {
    switch (type) {
      case "skill": {
        return Skill;
      }
      case "advantage": {
        return Advantage;
      }
      case "equipment": {
        return Equipment;
      }
      case "spell": {
        return Spell;
      }
      case "technique": {
        return Technique;
      }
      case "note": {
        return Note;
      }
      default: {
        throw new Error("");
      }
    }
  }
  $: item.update($model.saveFoundry());
  $: model.set(model.loadFoundry($item));
  $: if (character) character?.loadFoundry($actor);
</script>

<TailwindProvider>
  <div class="m-3">
    <DetailEditor character="{character}" item="{$model}" />
  </div>
</TailwindProvider>
