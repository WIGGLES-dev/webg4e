<script>
  import { tick } from "svelte"
  import { pdFoundryInstalled, openPDF } from "../pdfoundry.js"
  import { render } from "../components/ContextMenu.svelte"
  import { capitalize, addEventListeners } from "../util.js"
  import Tree from "../components/Tree.svelte"
  let classList = null
  export { classList as class }
  export let type
  export let document
  export let menu = {}
  export let itemsPerRow = 5
  export let setData = (item) => ({})
  const itemStore = document.$items
  let selected = {}
  let treeStack = []
  let viewingChildrenOf
  $: items = $itemStore.filter((item) => item.type === type)
  $: visible = (() => {
    if (viewingChildrenOf == null) {
      return items.filter((item) => item.getSystemFlag("parent") == null)
    } else {
      const item = items.find((item) => item.id === viewingChildrenOf.id)
      if (item) {
        return [...item.iterEmbeddedChildren()].filter(
          (item) => item.type === type
        )
      }
    }
    return []
  })()
  function addItem() {
    if (viewingChildrenOf != null) {
      viewingChildrenOf.addEmbeddedChild({
        type,
        name: `New ${capitalize(type)}`,
      })
    } else {
      document.createEmbeddedDocuments("Item", [
        {
          type,
          name: `New ${capitalize(type)}`,
        },
      ])
    }
  }
  function menuItems(item) {
    return [
      {
        label: "Edit",
        show: menu.edit,
        click: () => item.sheet.render(true),
      },
      {
        label: "Create Child",
        show: menu.embed,
        async click() {
          item.addEmbeddedChild({
            type,
            name: `New ${capitalize(type)}`,
          })
        },
      },
      {
        label: "Open PDF",
        get can() {
          return pdFoundryInstalled()
        },
        click() {
          const ref = row.getSystemFlag("pdfreference")
          if (ref) {
            const split = ref.search(/\d/)
            const [code, page] = [ref.slice(0, split), ref.slice(split)]
            openPDF(code, { page: +page })
          } else {
            ui.notifications.warn(`${ref} is not a valid page reference`)
          }
        },
      },
      {
        label: "Delete",
        class: "fas-fa-trash",
        show: menu.delete,
        warn: true,
        click: () => item.delete(),
      },
    ]
  }
  function viewChildren(item) {
    return function (e) {
      treeStack.push(item)
      viewingChildrenOf = item
    }
  }
  export function clearSelected() {
    selected = {}
  }
  export function reset() {
    clearSelected()
    viewingChildrenOf = null
    treeStack = []
  }
  export function viewParent() {
    viewingChildrenOf = treeStack.slice(0, -1).pop()
    treeStack = treeStack.slice(0, -1)
  }
  function deleteSelected() {
    const ids = Object.entries(selected)
      .filter(([id, selected]) => selected)
      .map(([id]) => id)
    for (const id of ids) {
      delete selected[id]
    }
    selected = selected
    document.deleteEmbeddedDocuments("Item", ids)
  }
  let dragging
  const drag = (node, item) => {
    const handlers = {
      click(e) {
        if (e.shiftKey) {
          selected[item.id] = !selected[item.id]
        }
      },
      dragstart(e) {
        dragging = item
        const img = new Image()
        img.src = item.data.img
        e.dataTransfer.setDragImage(
          DragDrop.createDragImage(img, 30, 30),
          -20,
          -20
        )
        for (const [key, value] of Object.entries(setData(item))) {
          e.dataTransfer.setData(key, value)
        }
      },
      dragenter(e) {
        e.preventDefault()
      },
      dragover(e) {
        e.preventDefault()
        const bounds = node.getBoundingClientRect()
        if (e.clientX - bounds.left > bounds.width / 2) {
          e.dataTransfer.dropEffect = "link"
        }
      },
      async drop(e) {
        const draggingI = items.indexOf(dragging)
        const targetI = items.indexOf(item)
        if (dragging) {
          if (draggingI === targetI) {
            if (e.dataTransfer.dropEffect === "link") {
            }
          } else {
            const sortBefore = draggingI > targetI
            const sort = SortingHelpers.performIntegerSort(dragging, {
              target: item,
              siblings: items,
              sortBefore,
            })
            const updates = sort.map((u) => ({
              _id: u.target.data._id,
              ...u.update,
            }))
            await document.updateEmbeddedDocuments("Item", updates)
          }
        }
      },
      dragend(e) {},
    }
    const removeEventListeners = addEventListeners(node, handlers)
    return {
      destroy() {
        removeEventListeners()
      },
      update(value) {
        item = value
      },
    }
  }
</script>

<div class={classList}>
  <menu class="py-1">
    {#if menu.add}
      <i class="fas fa-plus contrast" on:click={addItem} />
    {/if}
    {#if Object.values(selected).some((v) => v)}
      <i class="fas fa-trash warn" on:click={deleteSelected} />
    {/if}
    {#if viewingChildrenOf}
      <button type="button" class="w-max" on:click={viewParent}>
        View {viewingChildrenOf.name}
      </button>
      <i class="fas fa-angle-double-up contrast" on:click={reset} />
    {/if}
  </menu>
  <div class="flex">
    <ul class="flex-1 flex flex-wrap gap-4">
      {#each visible as item, i (item.id)}
        <li
          draggable="true"
          class="flex flex-col relative p-2 shadow-black shadow-md"
          class:selected={selected[item.id]}
          on:contextmenu={render(menuItems(item))}
          use:drag={item}
        >
          <div class="mx-2">
            <h3 class="text-center" on:click={viewChildren(item)}>
              <slot name="header">{item.name}</slot>
            </h3>
            <slot {item} viewChildren={viewChildren(item)} />
          </div>
        </li>
      {/each}
    </ul>
    <ul>
      <li on:click={reset}>root</li>
      {#key $document}
        <Tree
          value={[...document.items.values()].filter(
            (item) => item.getSystemFlag("parent") == null && item.type === type
          )}
          children={(v) => [...v.iterEmbeddedChildren()]}
          let:value
          let:depth
        >
          <li
            on:click={viewChildren(value)}
            style:padding-left="{(depth + 1) * 8}px"
          >
            <span>{value.name}</span>
          </li>
        </Tree>
      {/key}
    </ul>
  </div>
</div>

<style>
  .selected {
    @apply shadow-white shadow-md;
  }
</style>
