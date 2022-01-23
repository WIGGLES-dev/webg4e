<script>
  import {capitalize} from '../util.js'
  import Observe from './Observe.svelte'
  import { render } from './ContextMenu.svelte'
  export let type
  export let document
  export let tree = false
  export let sortable = false
  export let rowFilter = (row) => {
    return row.type === type
  }
  const depthCtx = (row) => {
    const ancestors = [...row.iterEmbeddedAncestors()]
    return {
      row,
      depth: ancestors.length,
    }
  }
  let items = document.$items
  let draggable = sortable
  const dragStartRow = (row) => function (e) {}
  const dragRow = (row) =>
    function (e) {
      if (draggable) e.preventDefault()
    }
  const dropRow = (row) => function (e) {}
  const dragOverRow = (row) =>
    function (e) {
      if (draggable) e.preventDefault()
    }
  const sortHeader = (row) => function (e) {}
  
  function addRow() {
    document.createEmbeddedDocuments('Item', [{
      type,
      name: `New ${capitalize(type)}`,
      data: {},
      flags: {
        [game.system.id]: {
        
        }
      }
    }])
  }
</script>

<style>
  table {
    @apply w-full text-left;
  }
  .data-row {
    @apply hover:bg-blue-200 hover:text-black;
  }
  .data-button {
    @apply hover:bg-green-500 p-1 hover:text-white w-full;
  }
  .warn {
    @apply hover:bg-red-500;
  }
</style>

<menu>
  <button class="data-button" on:click={addRow}>Add {capitalize(type)}</button>
</menu>
<table>
  {#if $$slots.caption}
    <caption>
      <slot name="caption" />
    </caption>
  {/if}
  <thead on:click={sortHeader}>
    <tr>
      {#if tree}
        <th />
      {/if}
      <slot name="header" />
    </tr>
  </thead>
  <tbody>
    {#each $items.filter(rowFilter).map(depthCtx) as { row, depth }, i (row.id)}
      <tr
        on:contextmenu={render([{
          label: 'Edit',
          click: () => {row.sheet?.render(true)}
        }, {
          label: 'Delete',
          click: () => {row.delete()}
        }])}
        class="data-row"
        {draggable}
        on:dragstart={dragStartRow(row)}
        on:drag={dragRow(row)}
        on:drop={dropRow(row)}
        on:dragover={dragOverRow(row)}>
        {#if tree && row.getFlag(game.system.id, 'container')}
          <Observe
            let:store
            let:value
            store={row.$getFlag(game.system.id, 'container open')}>
            <td
              style:margin-left="{depth}px"
              on:click={() => store.set(!value)}>
              <slot name="toggle">
                {#if value === true}{'<'}{:else if value === false}{'>'}{/if}
              </slot>
            </td>
          </Observe>
        {/if}
        <slot {row} />
      </tr>
    {/each}
  </tbody>
  {#if $$slots.footer}
    <tfoot>
      <slot name="footer" />
    </tfoot>
  {/if}
</table>
