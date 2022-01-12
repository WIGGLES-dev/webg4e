<script lang="ts">
  export let document: foundry.abstract.Document<any, any>;
  let data = document.data;
  let hasFlags = "flags" in data;
  let flags = data.flags;
</script>

{#if hasFlags}
  <ul>
    {#each Object.entries(flags) as [key, value], i}
      <li>
        <div>
          <h4>{key}</h4>
          <div>
            {JSON.stringify(value, undefined, 0)}
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <h3>No flags</h3>
{/if}
