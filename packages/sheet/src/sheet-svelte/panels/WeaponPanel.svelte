<script lang="ts">
  import { Character, Item, MeleeWeapon, RangedWeapon } from "gurpsjs";
  import MeleeWeaponTable from "../tables/MeleeWeaponTable.svelte";
  import MeleeWeaponForm from "../forms/MeleeWeaponForm.svelte";
  import RangedWeaponTable from "../tables/RangedWeaponTable.svelte";
  import RangedWeaponForm from "../forms/RangedWeaponForm.svelte";
  import SkillDefaultList from "../lists/SkillDefaults.svelte";
  export let item: Item;
  export let character: Character | undefined = undefined;
  export let type: "melee" | "ranged";
  $: constructor = type === "melee" ? MeleeWeapon : RangedWeapon;
  let selectedWeapon = [item.id, 0] as [string, number];
  function addWeapon() {
    $item.weapons = [...$item.weapons, new constructor()];
  }
  function removeSelected() {
    $item.weapons = $item.weapons.filter(
      (weapon, i) => i !== selectedWeapon[1]
    );
  }
</script>

<div>
  {#each $item.weapons as weapon, i}
    {#if selectedWeapon[1] === i && weapon instanceof constructor}
      <svelte:component
        this="{type === 'melee' ? MeleeWeaponForm : RangedWeaponForm}"
        bind:weapon
      />
    {/if}
  {/each}
  <hr class="h-3" />
  <menu>
    <button on:click="{addWeapon}">Add Weapon</button>
    <button on:click="{removeSelected}">Delete Weapon</button>
  </menu>

  <svelte:component
    this="{type === 'melee' ? MeleeWeaponTable : RangedWeaponTable}"
    item="{item}"
    character="{character}"
    bind:selected="{selectedWeapon}"
  />
  {#each $item.weapons as weapon, i}
    {#if selectedWeapon[1] === i && weapon instanceof constructor}
      <SkillDefaultList bind:defaults="{weapon.defaults}" />
    {/if}
  {/each}
</div>
