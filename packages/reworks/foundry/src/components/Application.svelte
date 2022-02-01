<script context="module">
  class SvelteApplication extends Application {
    async _renderInner() {
      return jQuery()
    }
  }
</script>

<script>
  import { createEventDispatcher, onMount } from "svelte"
  import Portal from "./Portal.svelte"
  import { concat } from "../util"
  const dispatch = createEventDispatcher()
  export let title
  export let width = 500
  export let height = 375
  export let classes = []
  export let resizable = true
  export let links = []
  let target
  const app = new SvelteApplication({
    title,
    width,
    height,
    resizable,
    classes: ["svelte", ...classes],
  })
  onMount(() => {
    const close = (_app) => {
      if (_app === app) {
        dispatch("close")
        return false
      }
    }
    const hook = `close${app.constructor.name}`
    Hooks.on(hook, close)
    return () => {
      Hooks.off(hook, close)
    }
  })
  app.render(true)
  requestAnimationFrame(() => {
    const shadow = app.element
      .find(".window-content")
      .get(0)
      .attachShadow({ mode: "open" })
    target = shadow
  })
</script>

{#if target}
  <Portal {target}>
    {#each links as link (link)}
      <link rel="stylesheet" href={link} media="all" />
    {/each}
    <slot />
  </Portal>
{/if}
