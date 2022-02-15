<script>
  import { onMount, tick } from "svelte"
  let classList
  export { classList as class }
  export let on = "change"
  export let value
  let innerValue = value
  export let store
  export let disabled = false
  export let options = []
  onMount(() => {
    const cb = (storeValue) => {
      innerValue = storeValue
    }
    store?.subscribe(cb)
  })
  async function setValue() {
    await tick()
    value = innerValue
  }
  function change(e) {
    if (on === "change") setValue()
  }
  function input(e) {
    if (on === "input") setValue()
  }
</script>

<select
  {disabled}
  class={classList}
  on:change={change}
  on:input={input}
  bind:value={innerValue}
>
  <slot>
    {#each options as [value, label]}
      <option {value}>{label || value}</option>
    {/each}
  </slot>
</select>
