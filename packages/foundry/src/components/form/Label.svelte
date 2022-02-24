<script>
  import Input from "./Input.svelte"
  let classList = ""
  export { classList as class }
  export let label = ""
  export let value = null
  export let checked = false
  export let type = undefined
  export let disabled = false
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class={classList}>
  <slot name="label">
    <span>{label}</span>
  </slot>
  <slot>
    <Input {disabled} {type} bind:value bind:checked />
  </slot>
</label>

<style>
</style>
