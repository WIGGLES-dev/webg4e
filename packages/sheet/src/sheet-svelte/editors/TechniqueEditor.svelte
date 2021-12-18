<script lang="ts">
  import { Character, Technique } from "gurpsjs";
  import BaseEditor from "./BaseEditor.svelte";
  import TechniqueForm from "../forms/TechniqueForm.svelte";
  export let character: Character | undefined = undefined;
  export let technique: Technique;
</script>

<BaseEditor item={technique} {character}>
  <svelte:fragment slot="data">
    <TechniqueForm bind:technique={$technique} {character} />
  </svelte:fragment>
  <!-- <svelte:fragment slot="defaults">
    <DefaultList
      bind:defaults={skill.defaults}
      settings={character?.settings}
    />
  </svelte:fragment> -->
</BaseEditor>
