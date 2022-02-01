<script>
  export let application
  export let document
  export let map
</script>

{#if document.type in map}
  <svelte:component this={map[document.type]} {application} {document} />
{:else}
  <h3>{document.type} does not support this view</h3>
{/if}
