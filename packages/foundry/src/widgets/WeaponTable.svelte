<script>
  import DataTable from "./DataTable.svelte"
  export let document
  function create() {
    return {
      usage: "",
      damage: "1d6",
    }
  }
  const path = `flags.${game.system.id}.weapons`
  const menu = { add: true, delete: true }
</script>

<DataTable {create} {document} {menu} {path} let:row={weapon} let:set let:i>
  <svelte:fragment slot="header">
    <th>Usage</th>
    <th>Damage</th>
  </svelte:fragment>
  <td>
    <input type="text" value={weapon.usage} on:change={set("usage")} />
  </td>
  <td>
    <input type="text" value={weapon.damage} on:change={set("damage")} />
  </td>
</DataTable>

<style>
  input {
    @apply w-full bg-transparent text-white;
  }
</style>
