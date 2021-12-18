<script lang="ts">
  import type { Character, Attribute, AttributeDef } from "gurpsjs";
  import ContentEditableControl from "../shared/ContentEditableControl.svelte";
  import Meter from "../shared/Meter.svelte";
  export let character: Character;
  export let attributes: Attribute[];
  $: pairs = attributes
    .map((attribute) => {
      const def = attribute.getDef(character);
      if (def) {
        return {
          attribute,
          def,
        };
      }
    })
    .filter(
      (
        set
      ): set is {
        def: AttributeDef;
        attribute: Attribute;
      } => typeof set === "object" && set.def != null && set.attribute != null
    );
</script>

<div class="relative grid gap-1 whitespace-nowrap pool-grid">
  {#each pairs as { attribute, def }, i (attribute.id)}
    {#if def && attribute}
      <div>[{attribute.getPointCost(character)}]</div>
      <ContentEditableControl
        type="number"
        value={attribute.getRemaining(character)}
        on:input={({ detail }) => attribute.setDamage(character, +detail)}
      />
      <div>of</div>
      <ContentEditableControl
        type="number"
        value={attribute.getCurrentValue(character)}
        on:input={({ detail }) => attribute.setCurrentValue(character, +detail)}
      />
      <div>{def.combinedName}</div>
      <Meter
        class="col-span-full w-full"
        color={def.color}
        value={attribute.getRemaining(character)}
        max={attribute.getCurrentValue(character)}
      />
    {/if}
  {/each}
</div>

<style lang="postcss">
  .pool-grid {
    grid-template-columns: repeat(2, min-content 1fr) min-content;
  }
</style>
