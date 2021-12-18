<script lang="ts" context="module">
  import TailwindProvider from "./shared/TailwindProvider.svelte";
  import { Character, Item } from "gurpsjs";
  import { getContext, setContext, hasContext } from "svelte";
  export const sheetSymbol = "Sheet Context";
  export type EventMap = {
    roll: { formula: string; data?: any };
    notify: string;
    edit: string;
    "delete item": string[];
    "add item": Item;
    sort: string[];
  };
  export interface SheetContext {
    dispatch: <EventKey extends Extract<keyof EventMap, string>>(
      type: EventKey,
      detail?: EventMap[EventKey]
    ) => void;
    character: Character;
  }
  export function getSheetContext() {
    if (hasContext(sheetSymbol)) {
      return getContext<SheetContext>(sheetSymbol);
    } else {
      throw new Error("Cannot get sheet context before it has been set");
    }
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SheetGCS from "./SheetGCS.svelte";
  import SheetTabbed from "./SheetTabbed.svelte";
  const dispatch = createEventDispatcher<{
    roll: { formula: string; data?: any };
    notify: string;
    edit: string;
    "delete item": string[];
    "add item": Item;
    sort: string[];
    "change view": string;
  }>();
  export let character = new Character();
  export let view = "gcs";
  const context: SheetContext = {
    dispatch,
    character,
  };
  setContext(sheetSymbol, context);
  function handleDelete(e: CustomEvent<string[]>) {
    const ids = e.detail;
    if (ids instanceof Array) {
      character.deleteItems(ids);
    }
  }
  function handleEdit(e: CustomEvent<string>) {
    dispatch("edit", e.detail);
  }
  function handleSort(e: CustomEvent<string[]>) {
    const order = e.detail;
    dispatch("sort", order);
  }
  function handleRoll(e: CustomEvent<{ formula: string }>) {
    dispatch("roll", e.detail);
  }
  function detectRoll(e: MouseEvent) {
    const target = e.composedPath()[0] as HTMLElement;
    if (target == null) return;
    let roll = target.dataset.roll;
    if (roll === undefined) return;
    let rollTarget =
      "rollTarget" in target.dataset
        ? target.dataset.rollTarget
        : target.textContent;
    const formula = roll + rollTarget;
    dispatch("roll", { formula });
  }
</script>

<TailwindProvider>
  <div on:click="{detectRoll}">
    {#if view === "gcs"}
      <SheetGCS
        on:delete="{handleDelete}"
        on:delete
        on:edit="{handleEdit}"
        on:edit
        on:sort="{handleSort}"
        on:sort
      />
    {:else if view === "tabbed"}
      <SheetTabbed
        on:delete="{handleDelete}"
        on:delete
        on:edit="{handleEdit}"
        on:edit
        on:sort="{handleSort}"
        on:sort
      />
    {:else}
      <h2>Sheet View Not Implemented</h2>
    {/if}
  </div>
</TailwindProvider>

<style lang="postcss">
</style>
