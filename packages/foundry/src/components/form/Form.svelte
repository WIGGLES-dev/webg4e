<script context="module">
  export const FormContext = Symbol("form context")
</script>

<script>
  import { setContext } from "svelte"
  let classList
  export { classList as class }
  setContext(FormContext, {
    registerControl() {},
  })
  function submit(e) {
    e.preventDefault()
  }
  function change() {}
  function input() {}
</script>

<form class={classList} on:change={change} on:input={input} on:submit={submit}>
  <slot />
</form>

<style lang="postcss">
  form :global(.col) {
    @apply grid gap-2 grid-cols-2 h-min m-3;
  }
  form :global(.col > *) {
    @apply contents;
  }
</style>
