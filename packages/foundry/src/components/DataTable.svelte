<script>
  import { render } from "./ContextMenu.svelte"
  import { createEventDispatcher } from "svelte"
  import { fly } from "svelte/transition"
  const dispatch = createEventDispatcher()
  export let key = undefined
  export let rowKey = (row, i) => row?.id ?? i
  export let setData = (row) => {}
  export let ctxmenu = false
  function menuItems(row) {
    let options
    if (typeof ctxmenu === "function") options = ctxmenu(row)
    if (typeof ctxmenu instanceof Array) options = ctxmenu
    if (options) {
      return render(options)
    }
  }
  export let highlight = true
  export let document
  export let sortable = false
  export let draggable = false
  export let menu = {}
  export let rows = []
  let dragging
  let dragover
  const dragStartRow = (row) =>
    function (e) {
      dragging = row
      const data = setData(row)
      if (typeof data) {
        for (const [key, value] of Object.entries(data)) {
          e.dataTransfer.setData(key, value)
        }
      }
      const img = new Image()
      img.src = row.data.img
      e.dataTransfer.setDragImage(
        DragDrop.createDragImage(img, 30, 30),
        -20,
        -20
      )
    }
  const dragRow = (row) =>
    function (e) {
      if (draggable) e.preventDefault()
    }
  const dropRow = (row) =>
    async function (e) {
      if (sortable) {
        const draggingI = rows.indexOf(dragging)
        const targetI = rows.indexOf(row)
        dispatch("sort", {
          dragging,
          target: row,
          siblings: rows,
          sortBefore: draggingI > targetI,
        })
      }
    }
  const dragOverRow = (row) =>
    function (e) {
      if (draggable) e.preventDefault()
      dragover = row
    }
  const dragLeaveRow = (row) => {
    return function (e) {
      dragover = null
    }
  }
  const dragEndRow = (row) =>
    function (e) {
      dragging = null
      dragover = null
    }

  function sortHeader(e) {
    const data = e.target.dataset.sort
  }

  function addRow() {
    dispatch("add")
  }
</script>

<menu class="flex">
  {#if menu.add}
    <i class="fas fa-plus data-action" on:click={addRow} />
  {/if}
</menu>
<table>
  {#if $$slots.caption}
    <caption>
      <slot name="caption" />
    </caption>
  {/if}
  <thead on:click={sortHeader}>
    <tr>
      <slot name="header" />
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i (rowKey(row, i))}
      <tr
        class="data-row"
        class:highlight
        class:dragging={dragging === row}
        class:dragover={dragover === row}
        {draggable}
        on:contextmenu={menuItems(row)}
        on:dragstart={dragStartRow(row)}
        on:drag={dragRow(row)}
        on:dragover={dragOverRow(row)}
        on:dragleave={dragLeaveRow(row)}
        on:drop={dropRow(row)}
        on:dragend={dragEndRow(row)}
        transition:fly={{ x: -100, duration: 250 }}
      >
        <slot {row} {i} />
      </tr>
    {/each}
  </tbody>
  {#if $$slots.footer}
    <tfoot>
      <slot name="footer" />
    </tfoot>
  {/if}
</table>

<style>
  menu .data-action {
    @apply p-1 hover:bg-green-500 text-xs;
  }
  table {
    @apply w-full text-left;
  }
  thead :global(th) {
    @apply pr-3 capitalize text-lg;
  }
  .data-row {
  }
  .data-row.highlight {
    @apply hover:bg-blue-200 hover:text-black;
  }
  .data-button {
    @apply hover:bg-green-500 p-1 hover:text-white w-full;
  }
  .dragging {
    @apply border border-solid border-red-500;
  }
  .dragover {
    @apply border border-solid border-green-500;
  }
</style>
