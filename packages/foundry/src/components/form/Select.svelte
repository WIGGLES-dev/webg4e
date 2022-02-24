<script>
  import { onMount, tick, createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  let classList
  export { classList as class }
  export let on = "change"
  export let value = null
  let innerValue = value
  export let store = undefined
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
    dispatch("change", e)
  }
  function input(e) {
    if (on === "input") setValue()
    dispatch("input", e)
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
