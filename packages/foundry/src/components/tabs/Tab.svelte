<script>
  import { render } from "../ContextMenu.svelte"
  import { getContext } from "svelte"
  import { TabsContext } from "./Tabs.svelte"
  let classList
  export { classList as class }
  const { registerTab } = getContext(TabsContext)
  const { select, selected } = registerTab()
</script>

<style lang="postcss">
  .tab {
    @apply p-1 m-1;
  }
  .active {
    @apply bg-white text-black;
  }
</style>

<li class:active="{$selected}" class="tab {classList}" on:click="{select}">
  <slot />
</li>
