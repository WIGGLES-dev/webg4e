<script lang="ts">
  import { propSort } from "../../common/sort";
  import { ContextMenu, ContextMenuOption } from "../shared/context-menu/index";
  import type { Item } from "gurpsjs";
  import { createEventDispatcher } from "svelte";
  function stringToNumber(string: string) {
    let number = 0;
    for (let i = 0; i < string.length; i++) {
      number += string.charCodeAt(i);
    }
    return number;
  }
  const dispatch = createEventDispatcher<{
    edit: string;
    delete: string[];
    add: undefined;
    sort: string[];
  }>();
  function sortHandler(e: MouseEvent) {
    const target = e.composedPath()[0] as HTMLElement;
    if (target) {
      let sort = target.dataset.sort;
      let descending = e.shiftKey;
      if (!sort) return;
      let newItems = [...items]
        .sort(propSort<Item>(sort as keyof Item, descending))
        .map((item) => item.id);
      dispatch("sort", newItems);
    }
  }
  let draggingId: string | undefined;
  function dragstartHandler(e: DragEvent, id: string) {
    draggingId = id;
  }
  function dragendHandler(e: DragEvent) {
    draggingId = undefined;
  }
  function dropHandler(e: DragEvent, id: string) {
    if (draggingId == null) return;
    const ids = items.map((item) => item.id);
    const draggingIndexOf = ids.indexOf(draggingId);
    const dropIndexOf = ids.indexOf(id);
    ids.splice(dropIndexOf, 0, ...ids.splice(draggingIndexOf, 1));
    dispatch("sort", ids);
  }
  function selectHandler(id: string) {
    if (activeIds.includes(id)) {
    } else {
      activeIds = [id];
    }
  }
  function focusHandler(e: MouseEvent) {
    const target = e.composedPath()[0] as HTMLElement;
    if (element?.contains(target)) {
      focused = true;
    } else {
      focused = false;
      activeIds = [];
    }
  }
  function keyboardNavigationHandler(e: KeyboardEvent) {
    if (focused != true) return;
    const ids = items.map((item) => item.id);
    const [activeId = ids[0]] = activeIds;
    const activeI = ids.indexOf(activeId);
    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault();
        let nextId = ids[Math.max(activeI - 1, 0)];
        activeIds = [nextId];
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        let nextId = ids[Math.min(activeI + 1, ids.length - 1)];
        activeIds = [nextId];
        break;
      }
      case "Delete": {
        e.preventDefault();
        dispatch("delete", activeIds);
        break;
      }
    }
  }
  let contextMenuId: string;
  let contextMenuPosition = {
    x: 0,
    y: 0,
  };
  function contextMenuHandler(e: MouseEvent, id: string) {
    contextMenuId = id;
    contextMenuPosition = {
      x: e.clientX,
      y: e.clientY,
    };
  }
  export let items: Item[];
  export let draggable = true;
  let element: HTMLDivElement | undefined;
  let focused = false;
  let activeIds: string[] = [];
</script>

<svelte:window
  on:mousedown="{focusHandler}"
  on:keydown="{keyboardNavigationHandler}"
/>
<div on:click="{sortHandler}" bind:this="{element}">
  <menu class="flex gap-1">
    <slot name="menu">
      <!--  -->
    </slot>
  </menu>
  <table class="rep-table">
    <thead>
      <slot name="thead">
        <!--  -->
      </slot>
    </thead>
    <tbody>
      {#each items as item, i (item.id)}
        <tr
          draggable="{draggable}"
          on:dblclick="{() => dispatch('edit', item.id)}"
          on:dragover|preventDefault
          on:dragstart="{(e) => dragstartHandler(e, item.id)}"
          on:drop="{(e) => dropHandler(e, item.id)}"
          on:dragend="{dragendHandler}"
          on:mousedown="{() => selectHandler(item.id)}"
          on:contextmenu|preventDefault="{(e) =>
            contextMenuHandler(e, item.id)}"
          id="{item.id}"
          class:active="{activeIds.includes(item.id)}"
        >
          <slot item="{item}" />
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <!--  -->
    </tfoot>
  </table>
</div>
<ContextMenu
  on:close="{() => (contextMenuId = '')}"
  open="{!!contextMenuId}"
  {...contextMenuPosition}
>
  <ContextMenuOption on:select="{() => dispatch('edit', contextMenuId)}">
    Edit
  </ContextMenuOption>
  <slot name="context menu" contextMenuId="{contextMenuId}">
    <!--  -->
  </slot>
  <ContextMenuOption on:select="{() => dispatch('delete', [contextMenuId])}">
    Delete
  </ContextMenuOption>
</ContextMenu>

<style lang="postcss">
</style>
