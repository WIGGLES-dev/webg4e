<script>
  import DataTable from "../components/DataTable.svelte"
  export let document
  const weapons = document.$getSystemFlag("weapons")
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
</script>

<DataTable
  menu={{ add: true }}
  rows={$weapons || []}
  on:add={addWeapon}
  let:row={weapon}
  let:i
>
  <svelte:fragment slot="header">
    <th>Usage</th>
    <th>Damage</th>
    <th />
  </svelte:fragment>
  <slot {weapon}>
    {#if weapon}
      <td>
        <input bind:value={$weapons[i].usage} />
      </td>
      <td>
        <input bind:value={$weapons[i].damage} />
      </td>
      <td on:click={deleteWeapon(i)}>
        <i class="fas fa-trash" />
      </td>
    {/if}
  </slot>
</DataTable>

<style>
  input {
    @apply w-full bg-transparent text-white;
  }
</style>
