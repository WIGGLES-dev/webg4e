<script lang="ts">
  import { Character, Equipment } from "gurpsjs";
  import BaseEditor from "./BaseEditor.svelte";
  import EquipmentForm from "../forms/EquipmentForm.svelte";
  export let equipment: Equipment;
  export let character: Character | undefined = undefined;
</script>

<BaseEditor item={equipment} {character}>
  <svelte:fragment slot="data">
    <EquipmentForm bind:equipment={$equipment} />
  </svelte:fragment>
</BaseEditor>
