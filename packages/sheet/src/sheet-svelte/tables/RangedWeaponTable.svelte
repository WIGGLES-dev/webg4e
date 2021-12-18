<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{
    select: [string, number];
  }>();
  import { Character, WeaponStats, RangedWeapon, Item } from "gurpsjs";
  export let character: Character | undefined = undefined;
  export let item: Item | undefined = undefined;
  let offset = 0;
  export let selected: [string, number] = ["", 0];
  function select(id: string, index: number) {
    selected = [id, index];
    dispatch("select", [id, index]);
  }
  let pairs: { item: Item; weapons: WeaponStats[] }[] = [];
  $: {
    if (item != null) {
      pairs = [
        {
          item,
          weapons: item.weapons,
        },
      ];
    } else if (character != null) {
      pairs = $character.getAllItems().flatMap((item) => ({
        item,
        weapons: item.weapons,
      }));
    }
  }
</script>

<table>
  <thead>
    <tr>
      <th>Ranged Weapons</th>
      <th>Usage</th>
      <th>Level</th>
      <th>Acc</th>
      <th>Damage</th>
      <th>Range</th>
      <th>RoF</th>
      <th>Shots</th>
      <th>Bulk</th>
      <th>Rcl</th>
      <th>ST</th>
    </tr>
  </thead>
  <tbody>
    {#each pairs as { item, weapons }}
      {#each weapons as weapon, i}
        {#if weapon instanceof RangedWeapon}
          <tr
            class="min-h-min whitespace-nowrap"
            data-i="{offset++}"
            class:active="{item.id === selected[0] && i === selected[1]}"
            on:click="{() => select(item.id, i)}"
          >
            <td>{item.name}</td>
            <td>{weapon.usage}</td>
            <td data-roll="3d6">
              {weapon.getSkillLevel(character)}
            </td>
            <td>{weapon.accuracy}</td>
            <td data-roll>
              {weapon.damage.toString(character)}
            </td>
            <td>{weapon.range}</td>
            <td>{weapon.rateOfFire}</td>
            <td>{weapon.shots}</td>
            <td>{weapon.bulk}</td>
            <td>{weapon.recoil}</td>
            <td>{weapon.strength}</td>
          </tr>
        {/if}
      {/each}
    {/each}
  </tbody>
</table>

<style lang="postcss">
</style>
