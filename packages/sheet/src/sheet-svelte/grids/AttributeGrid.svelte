<script lang="ts">
  import type { Character, Attribute, AttributeDef } from "gurpsjs";
  import ContentEditableControl from "../shared/ContentEditableControl.svelte";
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
  let attributeLevel: number;
</script>

<div class="grid gap-1 whitespace-nowrap attribute-grid">
  {#each pairs as { attribute, def }, i (attribute.id)}
    {#if def && attribute}
      <div>[{attribute.getPointCost(character)}]</div>
      <div class="pb-0.5 border-black border-solid border-b-2">
        <ContentEditableControl
          type="number"
          value="{(attributeLevel = attribute.getCurrentValue(character))}"
          on:input="{({ detail }) =>
            attribute.setCurrentValue(character, +detail)}"
        />
      </div>
      <div
        data-roll="3d6ms"
        class="hover:text-green-500"
        data-roll-target="{attributeLevel}"
      >
        {def.combinedName}
      </div>
    {/if}
  {/each}
</div>

<style lang="postcss">
  .attribute-grid {
    grid-template-columns: min-content 1fr min-content;
    height: min-content;
  }
</style>
