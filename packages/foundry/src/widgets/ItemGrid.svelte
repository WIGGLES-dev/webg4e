<script>
  import { render } from "../components/ContextMenu.svelte"
  import { capitalize, addEventListeners } from "../util.js"
  export let type
  export let document
  export let menu = {}
  export let itemsPerRow = 5
  export let setData = (item) => ({})
  const itemStore = document.$items
  $: items = $itemStore.filter((item) => item.type === type)
  function addItem() {
    document.createEmbeddedDocuments("Item", [
      {
        type,
        name: `New ${capitalize(type)}`,
      },
    ])
  }
  function menuItems(item) {
    return [
      {
        label: "edit",
        class: "fas-fa-edit",
        click: () => item.sheet.render(true),
      },
      {
        label: "delete",
        class: "fas-fa-trash",
        warn: true,
        click: () => item.delete(),
      },
    ]
  }
  let selected = {}
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
      async drop(e) {
        const draggingI = items.indexOf(dragging)
        const targetI = items.indexOf(item)
        if (dragging) {
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

<div>
  <menu class="item-grid-menu">
    {#if menu.add}
      <i class="fas fa-plus contrast" on:click={addItem} />
    {/if}
    {#if Object.values(selected).some((v) => v)}
      <i class="fas fa-trash warn" on:click={deleteSelected} />
    {/if}
  </menu>
  <ul class="item-grid">
    {#each items as item, i (item.id)}
      <li
        draggable="true"
        class="item-grid-item"
        class:selected={selected[item.id]}
        on:contextmenu={render(menuItems(item))}
        use:drag={item}
      >
        <div class="item-grid-item-content">
          <slot {item}>
            <!--  -->
          </slot>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .item-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  .item-grid-menu {
    padding: 0.5rem 0 0.5rem;
  }
  .item-grid-item {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0.5rem;
    box-shadow: 0 0 1rem #000;
  }
  .item-grid-item.selected {
    box-shadow: 0 0 1rem white;
  }
  .item-grid-item-menu {
    position: absolute;
    display: flex;
    top: 100%;
  }
  .item-grid-item-content {
    margin: 0 0.75rem 0 0.75rem;
  }
</style>
