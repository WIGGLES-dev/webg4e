<script lang="ts">
  import BaseTable from "./BaseTable.svelte";
  import ContentEditableField from "../shared/ContentEditableControl.svelte";
  import AttributeSelect from "../forms/AttributeSelect.svelte";
  import { Attribute, Character } from "gurpsjs";
  import { Skill, Technique } from "gurpsjs";
  export let character: Character;
  $: settings = $character.settings;
  $: skills = $character.getSkillsAndTechniques();
  function addSkillHandler() {
    character.addSkill();
  }
  function addTechniqueHandler() {
    character.addTechnique();
  }
  function changeMod(e: Event, skill: any) {
    if (skill instanceof Skill || skill instanceof Technique) {
      const value = +(e.target as HTMLInputElement).value;
      skill.mod = value;
      character.editItemNotifier.next(skill.id);
    }
  }
  function preventIfFocused(this: HTMLElement, e: KeyboardEvent) {
    //@ts-ignore
    const focusedElement = this.getRootNode()?.activeElement;
    if (focusedElement === this) {
      e.stopPropagation();
    }
  }
</script>

<BaseTable items={skills} let:item={skill} on:delete on:edit on:sort>
  <svelte:fragment slot="menu">
    <button on:click={addSkillHandler}>Add Skill</button>
    <button on:click={addTechniqueHandler}>Add Technique</button>
  </svelte:fragment>
  <tr slot="thead">
    <th data-sort="name">Skills</th>
    <th data-sort="attribute">Attribute</th>
    <th data-sort="level">SL</th>
    <th data-sort="points">Pts</th>
    <th data-sort="mod">Mod</th>
    <th data-sort="reference">Ref</th>
  </tr>
  {#if skill instanceof Skill || skill instanceof Technique}
    <td
      class:skill={skill instanceof Skill}
      class:technique={skill instanceof Technique}>{skill.formattedName}</td
    >
    <td>
      <AttributeSelect
        class="skill-float"
        disabled={true}
        {settings}
        attribute={skill.attribute}
      >
        <svelte:fragment let:attribute>
          {attribute.id}
        </svelte:fragment>
      </AttributeSelect>
    </td>
    <td data-roll="3d6ms">
      {skill.calculateLevel(character)}
    </td>
    <td>{skill.points}</td>
    <td>
      <input
        on:keydown|capture={preventIfFocused}
        class="border-none text-black"
        type="number"
        value={skill.mod}
        on:input={(e) => changeMod(e, skill)}
      />
    </td>
    <td>{skill.reference}</td>
  {/if}
</BaseTable>

<style lang="postcss">
  td > :global(select),
  input {
    @apply bg-transparent;
  }
  .skill-float {
  }
  .skill-float > option {
  }
  .technique {
    @apply text-purple-400;
  }
</style>
