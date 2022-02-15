<script>
  import { addEventListeners } from "../util.js"
  import Tree from "../components/Tree.svelte"
  import { render } from "./ContextMenu.svelte"
  import { createEventDispatcher } from "svelte"
  import { fly } from "svelte/transition"
  const dispatch = createEventDispatcher()
  export let key = undefined
  export let rowKey = (row, i) => row?.id ?? i
  export let setData = (row) => {}
  export let ctxmenu = false
  export let children = undefined
  export let sortable = false
  export let draggable = false
  export let menu = {}
  export let rows = []
  export let selected = false
  let dragging
  let dragover
  function menuItems(row) {
    let options
    if (typeof ctxmenu === "function") options = ctxmenu(row)
    if (typeof ctxmenu instanceof Array) options = ctxmenu
    if (options) {
      return render(options)
    }
  }
  const tablerow = (node, params) => {
    let { row, i } = params
    const handlers = {
      click(e) {
        selected = i
        dispatch("select", params)
      },
      contextmenu: menuItems(row),
      dragstart(e) {
        dragging = row
        const data = setData(row)
        if (typeof data === "object") {
          for (const [key, value] of Object.entries(data)) {
            e.dataTransfer.setData(key, value)
          }
        }
        if (typeof row?.data?.img === "string") {
          const img = new Image()
          img.src = row.data.img
          e.dataTransfer.setDragImage(
            DragDrop.createDragImage(img, 30, 30),
            -20,
            -20
          )
        }
      },
      drag(e) {
        if (draggable) e.preventDefault()
      },
      drop(e) {
        dispatch("drop", {
          row,
          event: e,
        })
        if (dragging) {
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
      },
      dragover(e) {
        if (draggable) e.preventDefault()
        dragover = row
      },
      dragleave(e) {
        dragover = null
      },
      dragend(e) {
        dragging = null
        dragover = null
      },
    }
    const removeEventListeners = addEventListeners(node, handlers)
    return {
      destroy() {
        removeEventListeners()
      },
      update(newRow) {
        params = newRow
        row = params.row
        i = params.i
      },
    }
  }
  function clickHeader(e) {
    const { sort, sortOrder } = e.target.dataset
    const get = (value) => {
      let out = value
      for (const key of sort.split(".")) {
        out = out[key]
      }
      if (typeof out === "string") {
        //
      }
      return out
    }
    let sortFunc
    if (sortOrder === "ascending") {
      sortFunc = (a, b) => get(b) - get(a)
    } else if (sortOrder === "descending") {
      sortFunc = (a, b) => get(a) - get(b)
    }
    dispatch("order", rows.sort(sortFunc))
    e.target.datset = sortOrder === "ascending" ? "descending" : "ascending"
  }
  function addRow() {
    dispatch("add")
  }
</script>

<div>
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
    <thead on:click={clickHeader}>
      <tr>
        <slot name="header" />
      </tr>
    </thead>
    <Tree key={rowKey} value={rows} let:value={row} {children} let:depth let:i>
      <slot name="row-before" />
      <tr
        use:tablerow={{ row, i }}
        class="data-row"
        class:selected={selected === i}
        class:dragging={dragging === row}
        class:dragover={dragover === row}
        {draggable}
        transition:fly={{ x: -100, duration: 250 }}
      >
        <slot {row} {depth} {i} />
      </tr>
      <slot name="row-after" />
    </Tree>
    {#if $$slots.footer}
      <tfoot>
        <slot name="footer" />
      </tfoot>
    {/if}
  </table>
</div>

<style>
  table :global(input),
  table :global(select) {
    @apply bg-transparent text-white;
  }
  table :global(option) {
    background: black;
  }
  menu .data-action {
    @apply p-1 hover:bg-green-500 text-xs;
  }
  table {
    @apply w-full text-left;
  }
  thead :global(th) {
    @apply pr-3 capitalize text-lg;
  }
  .data-row :global(td) {
  }
  .data-row:hover {
    @apply border border-solid border-white;
  }
  .data-button {
    @apply hover:bg-green-500 p-1 hover:text-white w-full;
  }
  .dragging {
    @apply border border-solid border-green-500 !important;
  }
  .dragover {
    @apply border border-solid border-white;
  }
</style>
