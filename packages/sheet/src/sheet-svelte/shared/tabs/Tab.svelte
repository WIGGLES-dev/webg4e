<script lang="ts">
  import { onMount, tick } from "svelte";
  import { getTabContext } from "./Tabs.svelte";
  let tabEl: HTMLElement;
  const tab = {};
  const { registerTab, registerTabElement, selectTab, selectedTab, controls } =
    getTabContext();
  let isSelected: boolean;
  $: isSelected = $selectedTab === tab;
  registerTab(tab);
  onMount(async () => {
    await tick();
    registerTabElement(tabEl);
  });
  function handleSelect() {
    selectTab(tab);
  }
</script>

<li
  bind:this={tabEl}
  role="tab"
  tabindex={isSelected ? 0 : -1}
  class:svelte-tabs__selected={isSelected}
  class="svelte-tabs__tab"
  on:click={handleSelect}
>
  <slot>
    <!--  -->
  </slot>
</li>

<style lang="postcss">
  .svelte-tabs__tab {
    border: none;
    border-bottom: 2px solid transparent;
    color: #000000;
    cursor: pointer;
    list-style: none;
    display: inline-block;
    padding: 0.5em 0.75em;
  }

  .svelte-tabs__tab:focus {
    outline: thin dotted;
  }
  .svelte-tabs__selected {
    border-bottom: 2px solid #4f81e5;
    color: #4f81e5;
  }
</style>
