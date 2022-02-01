<script>
  import Input from "./Input.svelte"
  export let label
  export let value
  export let checked
  export let type
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <slot name="label">
    <span>{label}</span>
  </slot>
  <slot>
    <Input {type} bind:value bind:checked />
  </slot>
</label>
