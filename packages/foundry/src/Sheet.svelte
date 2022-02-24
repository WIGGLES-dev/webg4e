<script>
  export let application
  export let document
</script>

{#await import(application.template)}
  <h3>...loading</h3>
{:then component}
  <svelte:component this={component.default} {application} {document} />
{:catch err}
  <h3>{document.type} does not support this view</h3>
  <pre>{err}</pre>
{/await}
