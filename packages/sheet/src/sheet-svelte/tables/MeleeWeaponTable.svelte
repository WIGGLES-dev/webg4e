<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{
    select: [string, number];
  }>();
  import { Character, WeaponStats, MeleeWeapon, Item } from "gurpsjs";
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
    <tr class="children:sticky">
      <th>Melee Weapons</th>
      <th>Usage</th>
      <th>Level</th>
      <th>Parry</th>
      <th>Block</th>
      <th>Damage</th>
      <th>Reach</th>
      <th>ST</th>
    </tr>
  </thead>
  <tbody>
    {#each pairs as { item, weapons }}
      {#each weapons as weapon, i}
        {#if weapon instanceof MeleeWeapon}
          <tr
            class="min-h-min whitespace-nowrap"
            data-i="{offset++}"
            class:active="{item.id === selected[0] && i === selected[1]}"
            on:click="{() => select(item.id, i)}"
          >
            <td>{item.name}</td>
            <td>{weapon.usage}</td>
            <td data-roll="3d6ms">
              {weapon.getSkillLevel(character)}
            </td>
            <td data-roll="3d6ms">
              {weapon.getParryLevelString(character)}
            </td>
            <td data-roll="3d6ms">
              {weapon.getBlockLevelString(character)}
            </td>
            <td data-roll>
              {weapon.damage.toString(character)}
            </td>
            <td>{weapon.reach}</td>
            <td>{weapon.strength}</td>
          </tr>
        {/if}
      {/each}
    {/each}
  </tbody>
</table>

<style lang="postcss">
</style>
