<script>
  export let application
  export let document
  $: ({ links = [] } = application.options)
</script>

{#each links as href}
  <link rel="stylesheet" type="text/css" media="all" {href} />
{/each}

{#await import(application.template)}
  <h3>...loading</h3>
{:then component}
  <svelte:component this={component.default} {application} {document} />
{:catch err}
  <h3>{document.type} does not support this view</h3>
  <pre>{err}</pre>
{/await}
