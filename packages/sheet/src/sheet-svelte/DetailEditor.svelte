<script lang="ts">
  import TailwindProvider from "./shared/TailwindProvider.svelte";
  import { createEventDispatcher } from "svelte";
  import {
    Character,
    Item,
    Skill,
    Technique,
    Advantage,
    Spell,
    Equipment,
  } from "gurpsjs";
  import {
    AdvantageEditor,
    EquipmentEditor,
    SkillEditor,
    SpellEditor,
    TechniqueEditor,
  } from "./editors/index";
  export let character: Character | undefined = undefined;
  export let item: Item;
</script>

<TailwindProvider>
  {#if item instanceof Skill}
    <SkillEditor bind:skill={item} {character} />
  {:else if item instanceof Technique}
    <TechniqueEditor bind:technique={item} {character} />
  {:else if item instanceof Advantage}
    <AdvantageEditor bind:advantage={item} {character} />
  {:else if item instanceof Spell}
    <SpellEditor bind:spell={item} {character} />
  {:else if item instanceof Equipment}
    <EquipmentEditor bind:equipment={item} {character} />
  {/if}
</TailwindProvider>
