<script lang="ts">
  export let document: foundry.abstract.Document<any, any>;
  import { iterDescendants } from "../composition";
  import { asyncGeneratorToArray } from "../util";
</script>

{#await asyncGeneratorToArray(iterDescendants(document)) then descendants}
  <ul>
    {#each descendants as { document, cursor }, i}
      <li>
        {JSON.stringify(document.data, undefined, 2)}
      </li>
    {/each}
  </ul>
{/await}
