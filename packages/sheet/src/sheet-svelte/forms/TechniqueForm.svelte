<script lang="ts">
  import { Character, Technique } from "gurpsjs";
  import BaseForm from "./BaseForm.svelte";
  export let character: Character | undefined = undefined;
  export let technique: Technique;
  import AttributeSelect from "./AttributeSelect.svelte";
  import DifficultySelect from "./SkillDifficulty.svelte";
  $: settings = character ? $character.settings : undefined;
  $: level = character ? $technique.calculateLevel($character) : 0;
</script>

<BaseForm>
  <label>
    <span>Name</span>
    <input type="text" name="name" bind:value={technique.name} />
  </label>
  <label>
    <span>Notes</span>
    <input type="text" name="notes" bind:value={technique.notes} />
  </label>
  <label>
    <span>Categories</span>
  </label>
  <fieldset>
    <legend>Defaults To</legend>
    <div>
      <AttributeSelect
        name="attribute"
        bind:attribute={technique.default.type}
        {settings}
      >
        <svelte:fragment let:attribute>
          {attribute.name}
        </svelte:fragment>
        <svelte:fragment slot="options after">
          <option value="skill">Skill</option>
          <option value="parry">Parry</option>
          <option value="block">Block</option>
          <option value="10">10</option>
        </svelte:fragment>
      </AttributeSelect>
      <input
        type="text"
        name="default.name"
        bind:value={technique.default.name}
      />
      <input
        type="text"
        name="default.specialization"
        bind:value={technique.default.specialization}
      />
      <input
        type="number"
        name="default.modifier"
        bind:value={technique.default.modifier}
      />
    </div>
  </fieldset>
  <label>
    <span>Limit</span>
    <input type="number" name="limit" bind:value={technique.limit} />
  </label>
  <label>
    <span>Difficulty</span>
    <DifficultySelect
      name="difficulty"
      bind:difficulty={technique.difficulty}
    />
  </label>
  <label>
    <span>Points</span>
    <input type="number" name="points" bind:value={technique.points} />
  </label>
  <label>
    <span>Level</span>
    <output>{level}</output>
  </label>
  <label>
    <span>Page Reference</span>
    <input type="text" name="reference" bind:value={technique.reference} />
  </label>
</BaseForm>
