<script lang="ts">
  import type { Skill, Character } from "gurpsjs";
  import BaseForm from "./BaseForm.svelte";
  import SkillDifficultyControl from "./SkillDifficulty.svelte";
  import EncumbranceMultipleControl from "./EncumbranceMultiple.svelte";
  import AttributeSelect from "./AttributeSelect.svelte";
  import ListControl from "./ListControl.svelte";
  export let character: Character | undefined = undefined;
  export let skill: Skill;
  $: settings = character ? $character.settings : undefined;
  $: level = character != null ? $skill.calculateLevel($character) : 0;
</script>

<BaseForm>
  <label>
    <span>Name</span>
    <input id="name" name="name" bind:value={skill.name} />
  </label>
  <label>
    <span>Specialization</span>
    <input type="text" bind:value={skill.specialization} />
  </label>
  <label>
    <span>Categories</span>
    <input type="text" />
  </label>
  <label>
    <span>Notes</span>
    <input type="text" bind:value={skill.notes} />
  </label>
  <label>
    <span>Tech Level</span>
    <input type="text" bind:value={skill.techLevel} />
  </label>
  <label>
    <span>Encumbrance Penalty Multiple</span>
    <EncumbranceMultipleControl
      bind:encumbranceMultiple={skill.enumbrancePenaltyMultiplier}
    />
  </label>
  <label>
    <span>Categories</span>
    <ListControl name="categories" bind:list={skill.categories} />
  </label>
  <label>
    <span>Difficulty</span>
    <SkillDifficultyControl name="difficulty" bind:difficulty={skill.difficulty} />
  </label>
  <label>
    <span>Attribute</span>
    <AttributeSelect name="attribute" bind:attribute={skill.attribute} {settings} />
  </label>
  {#if character}
    <label>
      <span>Points</span>
      <input type="number" bind:value={skill.points} />
    </label>
    <label>
      <span>Mod</span>
      <input type="number" bind:value={skill.mod} />
    </label>
    <label>
      <span>Level</span>
      <output>{level}</output>
    </label>
  {/if}
  <label>
    <span>Page Reference</span>
    <input type="text" bind:value={skill.reference} />
  </label>
</BaseForm>
