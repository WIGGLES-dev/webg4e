<script>
  export let key
  export let value
</script>

<ul>
  <li>
    <span>{key}</span>
    {#if typeof value === "object"}
      {#each Object.entries(value) as [key, value], i (i)}
        <svelte:self {key} {value} />
      {/each}
    {:else if typeof value === "number"}
      <!--  -->
    {:else if typeof value === "string"}
      <!--  -->
    {:else if typeof value === "number"}
      <!--  -->
    {:else if typeof value === "boolean"}
      <!--  -->
    {:else if typeof value === "function"}
      <!--  -->
    {:else if typeof value === "symbol"}
      <!--  -->
    {:else}
      <!--  -->
    {/if}
  </li>
</ul>
