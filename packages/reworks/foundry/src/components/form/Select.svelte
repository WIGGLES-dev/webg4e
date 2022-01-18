<script>
  let classList
  export { classList as class }
  export let on = 'change'
  export let value
  let innerValue = value
  export let store
  function setValue(select)
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
