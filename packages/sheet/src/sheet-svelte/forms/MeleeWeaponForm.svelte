<script lang="ts">
  import DiceEditor from "./DiceEditor.svelte";
  import { MeleeWeapon } from "gurpsjs";
  import BaseForm from "./BaseForm.svelte";
  export let weapon: MeleeWeapon;
</script>

<BaseForm>
  <label>
    <span>Usage</span>
    <input type="text" bind:value="{weapon.usage}" />
  </label>
  <label>
    <span>Strength</span>
    <input type="text" bind:value="{weapon.strength}" />
  </label>
  <label>
    <span>Notes</span>
    <input type="" />
  </label>
  <fieldset class="contents">
    <legend>Damage</legend>
    <div>
      <select bind:value="{weapon.damage.st}">
        <option value=""></option>
        <option value="thr">thr</option>
        <option value="" disabled>thr (leveled)</option>
        <option value="sw">sw</option>
        <option value="" disabled>sw (leveled)</option>
      </select>
      <DiceEditor bind:dice="{weapon.damage.base}" />
    </div>
    <!-- (<input />)
    <input type="text" />
    <input type="text" /> -->
  </fieldset>
  <label>
    <span>Reach</span>
    <input type="text" bind:value="{weapon.reach}" />
  </label>
  <label>
    <span>Parry Modifier</span>
    <input type="number" bind:value="{weapon.parry}" />
  </label>
  <label>
    <span>Block Modifier</span>
    <input type="text" bind:value="{weapon.block}" />
  </label>
</BaseForm>
