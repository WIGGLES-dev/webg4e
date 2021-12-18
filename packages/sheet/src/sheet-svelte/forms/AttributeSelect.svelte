<script lang="ts">
  import { CharacterSettings, AttributeDef } from "gurpsjs";
  export let settings: CharacterSettings = CharacterSettings.global;
  export let attribute: string;
  let attributes = [...settings.attributes.values()];
  export let disabled = false;
  let classList = "";
  export { classList as class };
  export let name = "";
</script>

<select {name} class={classList} bind:value={attribute} {disabled}>
  <slot name="options before" />
  {#each attributes as attribute, i (attribute.id)}
    <option value={attribute.id}>
      <slot {attribute}>{attribute.combinedName}</slot>
    </option>
  {/each}
  <slot name="options after" />
</select>
