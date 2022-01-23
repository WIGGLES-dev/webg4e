<script>
  import { sub } from '../../store.js'
  import { onMount } from 'svelte'
  let classList
  export { classList as class }
  export let on = 'change'
  export let value
  let innerValue = value
  export let path
  export let store
  onMount(() => {
    const cb = () => {}
    if (path && store) store = sub(store, ...path)
    store?.subscribe(cb)
  })
  function setValue(select) {
    value = innerValue
  }
  function change() {
    if (on === 'change') setValue(this)
  }
  function input() {
    if (on === 'input') setValue(this)
  }
</script>

<select
  class={classList}
  on:change={change}
  on:input={input}
  bind:value={innerValue}>
  <slot />
</select>
