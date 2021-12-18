<script lang="ts">
  import { ContextMenuOption } from "../shared/context-menu/index";
  import BaseTable from "./BaseTable.svelte";
  import type { Character } from "gurpsjs";
  import { Equipment } from "gurpsjs";
  export let character: Character;
  export let showingLocation = "carried";
  $: showingOther = showingLocation === "other";
  $: showingCarried = showingLocation === "carried";
  $: equipment = character.getEquipment();
  $: filteredEquipment = equipment.filter(
    (equipment) => equipment.location === showingLocation
  );
  function addHandler() {
    character.addEquipment(showingLocation);
  }
  function formatUses(uses?: number, maxUses?: number) {
    let string = "";
    const hasUses = typeof maxUses === "number" && maxUses > 0;
    if (hasUses) string += `${uses || 0}/${maxUses}`;
    return string;
  }
  function equipHandler(e: Event, item: Equipment) {
    const target = e.target as HTMLInputElement;
    item.equipped = target.checked;
    character.editItemNotifier.next(item.id);
  }
  let moveToLocation = "carried";
  function moveTo(id: string) {
    const equipment = character.getItem(id);
    if (equipment instanceof Equipment) {
      equipment.location = moveToLocation;
      character.editItemNotifier.next(id);
    }
  }
  function changeUses(id: string, change: number) {
    const equipment = character.getItem(id);
    if (equipment instanceof Equipment) {
      equipment.uses += change;
      character.editItemNotifier.next(id);
    }
  }
  function incrementUses(id: string) {
    changeUses(id, 1);
  }
  function decrementUses(id: string) {
    changeUses(id, -1);
  }
</script>

<BaseTable
  items="{filteredEquipment}"
  let:item="{eq}"
  on:delete
  on:edit
  on:sort
>
  <button slot="menu" on:click="{addHandler}">
    Add <span class="capitalize">{showingLocation}</span> Equipment
  </button>
  <tr slot="thead">
    {#if showingCarried}
      <th>E</th>
    {/if}
    <th data-sort="quantity">Q</th>
    <th data-sort="name">
      <select bind:value="{showingLocation}">
        <option value="carried">Carried</option>
        <option value="other">Other</option>
      </select>
      <span>Equipment</span>
    </th>
    <th data-sort="uses">Uses</th>
    <th data-sort="value">$</th>
    <th data-sort="weight">W</th>
    <th data-sort="eWeight">E$</th>
    <th data-sort="eValue">EW</th>
    <th data-sort="reference">Ref</th>
  </tr>
  {#if eq instanceof Equipment}
    {#if showingCarried}
      <td>
        <input
          type="checkbox"
          checked="{eq.equipped}"
          on:change="{(e) =>
            eq instanceof Equipment ? equipHandler(e, eq) : null}"
        />
      </td>
    {/if}
    <td> {eq.quantity}</td>
    <td>{eq.name}</td>
    <td
      on:contextmenu|stopPropagation|preventDefault="{() =>
        decrementUses(eq.id)}"
      on:click="{() => incrementUses(eq.id)}"
    >
      {formatUses(eq.uses, eq.maxUses)}
    </td>
    <td>{eq.value}</td>
    <td>{eq.weight}</td>
    <td>{eq.eValue}</td>
    <td>{eq.eWeight}</td>
    <td>{eq.reference}</td>
  {/if}
  <svelte:fragment slot="context menu" let:contextMenuId>
    <ContextMenuOption on:select="{() => moveTo(contextMenuId)}">
      <span>Move To</span>
      <select bind:value="{moveToLocation}">
        <option value="carried">Carried</option>
        <option value="other">Other</option>
      </select>
      <span>Equipment</span>
    </ContextMenuOption>
  </svelte:fragment>
</BaseTable>

<style lang="postcss">
  select {
    @apply bg-black text-white;
  }
</style>
