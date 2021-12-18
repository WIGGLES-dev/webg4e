<script lang="ts">
  import BaseTable from "./BaseTable.svelte";
  import { Character, SelfControlRoll } from "gurpsjs";
  import { Advantage } from "gurpsjs";
  export let character: Character;
  $: advantages = $character.getAdvantages();
  const addHandler = () => {
    character.addAdvantage();
  };
</script>

<BaseTable items={advantages} let:item={advantage} on:delete on:edit on:sort>
  <button slot="menu" on:click={addHandler}>Add Advantage</button>
  <span slot="add-menu-button">Add Advantage</span>
  <tr slot="thead">
    <th data-sort="name"> Advantage & Disadvantages </th>
    <th data-sort="adjustedPoints">Pts</th>
    <th>CR</th>
    <th data-sort="reference">Ref</th>
  </tr>
  {#if advantage instanceof Advantage}
    <td>{advantage.name}</td>
    <td>{advantage.getAdjustedPoints()}</td>
    <td data-roll="3d6ms">
      {advantage.cr === SelfControlRoll.NoneRequired ? "" : advantage.cr}
    </td>
    <td>{advantage.reference}</td>
  {/if}
</BaseTable>
