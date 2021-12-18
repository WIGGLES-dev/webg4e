<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch =
    createEventDispatcher<{
      edit: string;
    }>();
  import { Character } from "gurpsjs";
  export let characters: Character[];
</script>

<div class="flex">
  <ul>
    {#each characters as character, i (character.id)}
      <li>
        <h3>{character.profile.name}</h3>
        <img src={character.getWebProfileSrc()} alt="portrait" />
        <button on:click={() => dispatch("edit", character.id)}>
          Open Sheet
        </button>
      </li>
    {/each}
  </ul>
  <div>
    <!--  -->
  </div>
</div>
