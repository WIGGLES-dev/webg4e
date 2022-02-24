<script context="module">
  export const TabsContext = Symbol("Tabs")
</script>

<script>
  import { setContext, createEventDispatcher } from "svelte"
  import { writable, derived } from "svelte/store"
  const dispatch = createEventDispatcher()
  let classList = null
  export { classList as class }
  export let key
  export let active = key ? +localStorage.getItem(key) : 0
  const activeStore = writable(typeof active === "number" ? active : 0)
  $: {
    if ($activeStore !== active) {
      active = $activeStore
      dispatch("tabchange", active)
      if (key) localStorage.setItem(key, active.toString())
    }
  }
  let tabs = 0
  let panels = 0
  const activeFlag = (id) => derived(activeStore, (activeId) => activeId === id)
  const registerTab = () => {
    let id = tabs++
    return {
      select: () => activeStore.set(id),
      selected: activeFlag(id),
    }
  }
  const registerPanel = () => {
    let id = panels++
    return activeFlag(id)
  }
  setContext(TabsContext, {
    registerTab,
    registerPanel,
  })
</script>

<div class={classList}>
  <slot />
</div>
