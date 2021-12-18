<script lang="ts">
  import { Character, Advantage } from "gurpsjs";
  import BaseEditor from "./BaseEditor.svelte";
  import AdvantageForm from "../forms/AdvantageForm.svelte";
  export let character: Character | undefined = undefined;
  export let advantage: Advantage;
</script>

<BaseEditor item={advantage} {character}>
  <svelte:fragment slot="data">
    <AdvantageForm bind:advantage={$advantage} />
  </svelte:fragment>
</BaseEditor>
