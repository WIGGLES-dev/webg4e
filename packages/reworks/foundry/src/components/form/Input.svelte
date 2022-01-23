<script>
  import { onMount } from "svelte"
  import { sub } from "../../store.js"
  let classList
  export { classList as class }
  export let type
  export let value
  export let store
  export let path
  export let readonly
  onMount(() => {
    const cb = (storeValue) => (value = storeValue)
    if (path && store) store = sub(store, ...path).subscribe(cb)
    return store?.subscribe(cb)
  })
  export let on = "change"
  function setValue(input) {
    switch (input.type) {
      case "text": {
        value = input.value
        break
      }
      case "number": {
        value = +input.value
        break
      }
      case "checkbox": {
        value = input.checked
        break
      }
    }
    store?.set(value)
  }
  function change(e) {
    if (on === "change") setValue(this)
  }
  function input(e) {
    if (on === "input") setValue(this)
  }
  function inferType(value) {
    if (type) return type
    switch (typeof value) {
      case "string":
        return "text"
      case "number":
        return "number"
      case "boolean":
        return "checkbox"
    }
  }
</script>

<input
  {readonly}
  class="{classList}"
  type="{inferType(value)}"
  on:change="{change}"
  on:input="{input}"
  {value} />
