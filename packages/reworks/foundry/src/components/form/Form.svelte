<script context="module">
  export const FormContext = Symbol("form context")
</script>

<script>
  import { setContext } from "svelte"
  let classList
  export { classList as class }
  function submit(e) {
    e.preventDefault()
  }
</script>

<form class="{classList}" on:submit="{submit}">
  <slot />
</form>
