<script>
  import DataTable from "../components/DataTable.svelte"
  export let document
  function addWeapon(e) {
    const weapons = document.getSystemFlag("weapons") || []
    const weapon = {
      usage: "",
      damage: "1d6",
    }
    document.setSystemFlag("weapons", [...weapons, weapon])
  }
  function deleteWeapon(index) {
    return function (e) {
      const weapons = document
        .getSystemFlag("weapons")
        .filter((v, i) => i !== index)
      document.setSystemFlag("weapons", weapons)
    }
  }
  $: weapons = $document.data.weapons || []
  function menuItems(row) {
    return []
  }
</script>

<DataTable
  menu={{ add: true }}
  highlight={false}
  rows={weapons}
  on:add={addWeapon}
>
  <svelte:fragment slot="header">
    <th>Name</th>
    <th>Damage</th>
    <th />
  </svelte:fragment>
  <svelte:fragment let:row={weapon} let:i>
    <slot {weapon}>
      {#if weapon}
        <td>
          <input
            bind:value={$document.flags[window.game.system.id].weapons[i].usage}
          />
        </td>
        <td>
          <input
            bind:value={$document.flags[window.game.system.id].weapons[i]
              .damage}
          />
        </td>
        <td on:click={deleteWeapon(i)}>
          <i class="fas fa-trash" />
        </td>
      {/if}
    </slot>
  </svelte:fragment>
</DataTable>

<style>
  input {
    @apply w-full bg-transparent text-white;
  }
</style>
