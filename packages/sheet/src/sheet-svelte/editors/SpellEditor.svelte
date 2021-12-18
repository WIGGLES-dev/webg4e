<script lang="ts">
  import { Character, Spell } from "gurpsjs";
  import BaseEditor from "./BaseEditor.svelte";
  import SpellForm from "../forms/SpellForm.svelte";
  import DefaultList from "../lists/SkillDefaults.svelte";
  export let character: Character | undefined = undefined;
  export let spell: Spell;
</script>

<BaseEditor item={spell} {character}>
  <svelte:fragment slot="data">
    <SpellForm bind:spell={$spell} {character} />
  </svelte:fragment>
  <!-- <svelte:fragment slot="defaults">
    <DefaultList
      bind:defaults={Spell.defaults}
      settings={character?.settings}
    />
  </svelte:fragment> -->
</BaseEditor>
