<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch =
    createEventDispatcher<{
      add: undefined;
      remove: number;
      edit: undefined;
    }>();
  import { SkillDefault, CharacterSettings } from "gurpsjs";
  import BaseList from "./BaseList.svelte";
  export let settings = CharacterSettings.global;
  export let defaults: SkillDefault[];
  function addDefault() {
    defaults = [...defaults, new SkillDefault()];
    dispatch("add");
  }
  function removeDefault(i: number) {
    defaults = defaults.filter((sd, _i) => i !== _i);
    dispatch("remove", i);
  }
  export let key = "";
</script>

<div class="flex flex-col">
  <menu>
    <button on:click={addDefault}>Add Default</button>
  </menu>
  <ul data-each={key} class="grid mt-4 default-list">
    {#each defaults as sd, i}
      <li data-i={i} class="contents">
        <span class="text-center w-8">{i === 0 ? "" : "or"}</span>
        <div>
          <select name="type" bind:value={sd.type}>
            {#each settings.getAttributeSelectInformation() as [value, label], i}
              <option {value}> {label}</option>
            {/each}
            <option value="skill">Skill</option>
            <option value="parry">Parry</option>
            <option value="block">Block</option>
            <option value={10}>10</option>
          </select>
          {#if sd.type === "skill"}
            <div class="pl-2 pt-2 flex gap-1">
              <input
                type="text"
                name="name"
                placeholder="Skill Named"
                bind:value={sd.name}
              />
              <input
                type="text"
                name="specialization"
                placeholder="With Specialization"
                bind:value={sd.specialization}
              />
              <input
                type="number"
                name="modifier"
                placeholder="Modifier"
                bind:value={sd.modifier}
              />
            </div>
          {:else}
            <input
              type="number"
              name="modifier"
              placeholder="Modifier"
              bind:value={sd.modifier}
            />
          {/if}
        </div>
        <div class="hover:text-red-500" on:click={() => removeDefault(i)}>
          🗑
        </div>
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  .default-list {
    grid-template-columns: min-content 1fr min-content;
  }
</style>
