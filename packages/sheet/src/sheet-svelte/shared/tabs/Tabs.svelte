<script lang="ts" context="module">
  import { getContext, hasContext, setContext } from "svelte";
  import { writable, Writable } from "svelte/store";
  export const tabsSymbol = Symbol("Tab Context");
  export interface TabContext {
    registerTab(tab: any): void;
    registerTabElement(tabElement: any): void;
    registerPanel(panel: any): void;
    selectTab(tab: any): void;
    selectedTab: Writable<object | null>;
    selectedPanel: Writable<object | null>;
    controls: Writable<object | null>;
    labeledBy: Writable<object | null>;
  }
  export const getTabContext = () => {
    if (hasContext(tabsSymbol)) {
      return getContext<TabContext>(tabsSymbol);
    } else {
      throw new Error("Cannot get tab context outside of a tabs component");
    }
  };
</script>

<script lang="ts">
  import { afterUpdate, onDestroy, onMount, tick } from "svelte";
  export let selectedTabIndex = 0;
  const tabElements: HTMLElement[] = [];
  const tabs: object[] = [];
  const panels: object[] = [];
  const controls = writable({});
  const labeledBy = writable({});
  const selectedTab = writable<object | null>(null);
  const selectedPanel = writable<object | null>(null);
  function removeAndUpdateSelected(
    arr: any[],
    item: any,
    selectedStore: Writable<any>
  ) {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
    selectedStore.update((selected) =>
      selected === item ? arr[index] || arr[arr.length - 1] : selected
    );
  }
  function registerItem(arr: any[], item: any, selectedStore: Writable<any>) {
    arr.push(item);
    selectedStore.update((selected) => selected || item);
    onDestroy(() => removeAndUpdateSelected(arr, item, selectedStore));
  }
  function selectTab(tab: any) {
    selectedTabIndex = tabs.indexOf(tab);
    selectedTab.set(tab);
    selectedPanel.set(panels[selectedTabIndex]);
  }
  const context: TabContext = {
    registerTabElement(tabElement) {
      tabElements.push(tabElement);
    },
    registerTab(tab) {
      registerItem(tabs, tab, selectedTab);
    },
    registerPanel(panel) {
      registerItem(panels, panel, selectedPanel);
    },
    selectTab,
    selectedTab,
    selectedPanel,
    controls,
    labeledBy,
  };
  setContext(tabsSymbol, context);
  onMount(() => {
    selectTab(tabs[selectedTabIndex]);
  });
  afterUpdate(() => {});
  $: {
    selectedTab.set(tabs[selectedTabIndex]);
    selectedPanel.set(panels[selectedTabIndex]);
  }
  async function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (!$selectedTab) return;
    if (target.classList.contains("svelte-tabs__tab")) {
      let selectedIndex = tabs.indexOf($selectedTab);
      switch (e.key) {
        case "ArrowRight": {
          selectedIndex += 1;
          if (selectedIndex > tabs.length - 1) {
            selectedIndex = 0;
          }
          selectTab(tabs[selectedIndex]);
          tabElements[selectedIndex].focus();
          break;
        }
        case "ArrowLeft": {
          selectedIndex -= 1;
          if (selectedIndex < 0) {
            selectedIndex = tabs.length - 1;
          }
          selectTab(tabs[selectedIndex]);
          tabElements[selectedIndex].focus();
        }
      }
    }
  }
</script>

<div class="svelte-tabs" on:keydown={handleKeydown}>
  <slot>
    <!--  -->
  </slot>
</div>
