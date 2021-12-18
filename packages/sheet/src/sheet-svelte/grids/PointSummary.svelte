<script lang="ts">
  import { Character } from "gurpsjs";
  import ContentEditableControl from "../shared/ContentEditableControl.svelte";
  export let character: Character;
  $: unspent = $character.unspentPoints;
  $: race = $character.racePoints;
  $: attributes = $character.attributePoints;
  $: advantages = $character.advantagePoints;
  $: disadvantages = $character.disadvantagePoints;
  $: quirks = $character.quirkPoints;
  $: skills = $character.skillPoints;
  $: spells = $character.spellPoints;
  $: order = {
    race,
    attributes,
    advantages,
    disadvantages,
    quirks,
    skills,
    spells,
  };
</script>

<div class="grid whitespace-nowrap gap-1 point-summary">
  <ContentEditableControl type="number" bind:value={$character.unspentPoints} />
  <div>Unspent</div>
  {#each Object.entries(order) as [label, value], i}
    <div>{value}</div>
    <div class="capitalize">{label}</div>
  {/each}
</div>

<style lang="postcss">
  .point-summary {
    grid-template-columns: min-content 1fr;
  }
</style>
