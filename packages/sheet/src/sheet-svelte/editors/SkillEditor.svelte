<script lang="ts">
  import { Character, Skill } from "gurpsjs";
  import BaseEditor from "./BaseEditor.svelte";
  import SkillForm from "../forms/SkillForm.svelte";
  import DefaultList from "../lists/SkillDefaults.svelte";
  export let character: Character | undefined = undefined;
  export let skill: Skill;
</script>

<BaseEditor item={$skill} {character}>
  <svelte:fragment slot="data">
    <SkillForm bind:skill={$skill} {character} />
  </svelte:fragment>
  <!-- <svelte:fragment slot="defaults">
    <DefaultList
      bind:defaults={skill.defaults}
      settings={character?.settings}
    />
  </svelte:fragment> -->
</BaseEditor>
