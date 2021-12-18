<script lang="ts">
  import { Character, Spell } from "gurpsjs";
  import BaseForm from "./BaseForm.svelte";
  import DifficultySelect from "./SkillDifficulty.svelte";
  import AttributeSelect from "./AttributeSelect.svelte";
  export let character: Character | undefined = undefined;
  export let spell: Spell;
  $: settings = character ? character.settings : undefined;
  $: level = character ? spell.calculateLevel($character) : 0;
</script>

<BaseForm>
  <label>
    <span>Name</span>
    <input type="text" bind:value={spell.name} />
  </label>
  <label>
    <span>Tech Level</span>
    <input type="text" bind:value={spell.techLevel} />
  </label>
  <label>
    <span>College</span>
    <input type="text" bind:value={spell.college} />
  </label>
  <label>
    <span>Power Source</span>
    <input type="text" bind:value={spell.powerSource} />
  </label>
  <label>
    <span>Class</span>
    <input type="text" bind:value={spell.spellClass} />
  </label>
  <label>
    <span>Resistance</span>
    <input type="text" bind:value={spell.resist} />
  </label>
  <label>
    <span>Casting Cost</span>
    <input type="text" bind:value={spell.castingCost} />
  </label>
  <label>
    <span>Casting Time</span>
    <input type="text" bind:value={spell.castingTime} />
  </label>
  <label>
    <span>Maintenance Cost</span>
    <input type="text" bind:value={spell.maintenanceCost} />
  </label>
  <label>
    <span>Duration</span>
    <input type="text" bind:value={spell.duration} />
  </label>
  <label>
    <span>Difficulty</span>
    <DifficultySelect bind:difficulty={spell.difficulty} />
  </label>
  <label>
    <span>Attribute</span>
    <AttributeSelect bind:attribute={spell.attribute} {settings} />
  </label>
  <label>
    <span>Points</span>
    <input type="number" bind:value={spell.points} />
  </label>
  <label>
    <span>Level</span>
    <output>{level}</output>
  </label>
</BaseForm>
