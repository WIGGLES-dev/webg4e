<script lang="ts">
  import BaseTable from "./BaseTable.svelte";
  import type { Character } from "gurpsjs";
  import { Spell } from "gurpsjs";
  export let character: Character;
  $: spells = $character.getSpells();
  const addHandler = () => {
    character.addSpell();
  };
</script>

<BaseTable items={spells} let:item={spell} on:delete on:edit on:sort>
  <button slot="menu" on:click={addHandler}>Add Spell</button>
  <tr slot="thead">
    <th data-sort="name">Spells</th>
    <th data-sort="resist">Resist</th>
    <th data-sort="spellClass">Class</th>
    <th data-sort="castingCost">Cost</th>
    <th data-sort="maintenanceCost">Maintain</th>
    <th data-sort="castingTime">Time</th>
    <th data-sort="duration">Duration</th>
    <th>SL</th>
    <th>RSL</th>
    <th data-sort="points">Pts</th>
    <th data-sort="reference">Reference</th>
  </tr>
  {#if spell instanceof Spell}
    <td>{spell.name}</td>
    <td>{spell.resist}</td>
    <td>{spell.spellClass}</td>
    <td>{spell.castingCost}</td>
    <td>{spell.maintenanceCost}</td>
    <td>{spell.castingTime}</td>
    <td>{spell.Duration}</td>
    <td data-roll="3d6ms">{spell.calculateLevel(character)}</td>
    <td>
      <!--  -->
    </td>
    <td>{spell.points}</td>
    <td>{spell.reference}</td>
  {/if}
</BaseTable>
