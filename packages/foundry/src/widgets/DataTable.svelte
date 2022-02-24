<script>
  import { onDestroy } from "svelte"
  import { get, set, capitalize } from "../util.js"
  import { render } from "../components/ContextMenu.svelte"
  import Tree from "../components/Tree.svelte"
  export let document
  const data = document.$data
  const items = document.$items
  export let setData = (row) => {}
  export let children
  export let key = (row) => row.id
  export let tree = false
  export let type = null
  export let path = ""
  export let create = () => {}
  export let menu = {}
  export let id = document.id + (type || path)
  $: open = JSON.parse(localStorage.getItem(id) || "{}")
  onDestroy(() => localStorage.setItem(key, JSON.stringify(open)))
  export function addRow() {
    if (type) {
      document.createEmbeddedDocuments("Item", {
        type,
        name: `New ${capitalize(type)}`,
      })
    } else {
      const arr = get(document.data, path) || []
      document.update({
        [path]: [...arr, create()],
      })
    }
  }
  function removeRow(row, i) {
    if (row instanceof foundry.abstract.Document) {
      row.delete()
    } else {
      const root = document.toObject()
      set(root, path, (arr) => arr.filter((v, index) => i !== index))
      document.update(root)
    }
  }
  function filterRow(row, i) {
    return function (setPath, filter) {
      const root = document.toObject()
      set(root, `${path}.${i}.${setPath}`, (arr) => arr.filter(filter))
      document.update(root)
    }
  }
  function appendRow(row, i) {
    return function (setPath, value) {
      const root = document.toObject()
      set(root, `${path}.${i}.${setPath}`, (arr) => [...arr, value])
      console.log(root)
      document.update(root)
    }
  }
  function setRow(row, i) {
    return function (setPath) {
      return function (e) {
        let value
        if ("type" in e.target) {
          switch (e.target.type) {
            case "number": {
              value = +e.target.value
              break
            }
            case "checkbox": {
              value = e.target.checked
              break
            }
            default: {
              value = e.target.value
            }
          }
        } else {
          value = e.target.value
        }
        if (row instanceof foundry.abstract.Document) {
          const root = row.toObject()
          set(root, path + "." + setPath, value)
          row.update(root)
        } else {
          const root = document.toObject()
          const obj = get(root, path)[i]
          set(obj, setPath, value)
          document.update(root)
        }
      }
    }
  }
  function menuItems(row, i) {
    return [
      {
        label: "Edit",
        show: row instanceof foundry.abstract.Document,
        click() {
          row.sheet.render(true)
        },
      },
      {
        label: "Create Child",
        show: tree,
      },
      {
        label: "Remove Children",
        show: tree,
      },
      {
        label: "Delete",
        show: menu.delete,
        warn: true,
        click() {
          removeRow(row, i)
        },
      },
    ]
  }
  $: rows = (() => {
    if (type) {
      return $items.filter((item) => item.type === type)
    } else if (path) {
      return get($data, path) || []
    }
    return []
  })()
</script>

<div>
  <menu>
    {#if menu.add}
      <i class="fas fa-plus contrast" on:click={addRow} />
    {/if}
  </menu>
  <table>
    {#if $$slots.caption}
      <caption>
        <slot name="caption" />
      </caption>
    {/if}
    {#if $$slots.header}
      <thead>
        <tr>
          {#if tree}
            <th />
          {/if}
          <slot name="header" />
        </tr>
      </thead>
    {/if}
    {#each rows as row, i (key(row) || i)}
      {@const open = open[key(row)]}
      <Tree rootOnly={!tree} value={row} {children} let:depth>
        <tr on:contextmenu={render(menuItems(row, i))}>
          {#if tree && children(row) instanceof Array}
            <td>
              <i
                style:padding-left="{6 * depth}px"
                class="fas"
                class:fa-caret-right={open === false}
                class:fa-caret-down={open === true}
              />
            </td>
          {/if}
          <slot
            {row}
            set={setRow(row, i)}
            append={appendRow(row, i)}
            filter={filterRow(row, i)}
            {i}
          />
        </tr>
      </Tree>
    {/each}
    {#if $$slots.footer}
      <tfoot>
        <slot name="footer" />
      </tfoot>
    {/if}
  </table>
</div>
