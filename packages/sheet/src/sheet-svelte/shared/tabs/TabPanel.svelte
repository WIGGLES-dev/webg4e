<script lang="ts">
  import { getTabContext } from "./Tabs.svelte";
  const panel = {};
  const { registerPanel, selectedPanel, labeledBy } = getTabContext();
  registerPanel(panel);
</script>

<div class="svelte-tabs__tab-panel" role="tabpanel">
  {#if $selectedPanel === panel}
    <slot />
  {/if}
</div>

<style>
  .svelte-tabs__tab-panel {
    margin-top: 0.5em;
  }
</style>
