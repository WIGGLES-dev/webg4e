<script>
  export let href
  export let props
</script>

{#await import(href)}
  <slot name="loading" />
{:then module}
  <svelte:component this={module.default} {...props}>
    <slot />
  </svelte:component>
{:catch err}
  <pre>{err}</pre>
{/await}
