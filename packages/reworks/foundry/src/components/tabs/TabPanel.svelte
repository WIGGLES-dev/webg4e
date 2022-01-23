<script>
  import { getContext } from 'svelte'
  import { TabsContext } from './Tabs.svelte'
  const { registerPanel } = getContext(TabsContext)
  const open = registerPanel()
</script>

<div class:hidden={!$open}>
  <slot />
</div>
