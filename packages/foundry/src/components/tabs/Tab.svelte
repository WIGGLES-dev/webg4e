<script>
  import { render } from "../ContextMenu.svelte"
  import { getContext } from "svelte"
  import { TabsContext } from "./Tabs.svelte"
  let classList = ""
  export { classList as class }
  const { registerTab } = getContext(TabsContext)
  const { select, selected } = registerTab()
</script>

<li class:active={$selected} class="tab {classList}" on:click={select}>
  <slot />
</li>

<style>
  .tab {
    @apply p-2;
  }
  .tab:hover {
    @apply bg-white opacity-75 text-black;
  }
  .active {
    @apply bg-white opacity-75 text-black;
  }
</style>
