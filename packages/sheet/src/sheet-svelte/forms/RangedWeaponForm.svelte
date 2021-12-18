<script lang="ts">
  import { RangedWeapon } from "gurpsjs";
  import DiceEditor from "./DiceEditor.svelte";
  import BaseForm from "./BaseForm.svelte";
  export let weapon: RangedWeapon;
</script>

<BaseForm>
  <label>
    <span>Usage</span>
    <input type="text" bind:value={weapon.usage} />
  </label>
  <label>
    <span>Minimum Strength</span>
    <input type="text" bind:value={weapon.strength} />
  </label>
  <label>
    <span>Notes</span>
    <input type="text" />
  </label>
  <fieldset class="contents">
    <legend>Damage</legend>
    <div>
      <select bind:value={weapon.damage.st}>
        <option value="" />
        <option value="thr">thr</option>
        <option value="" disabled>thr (leveled)</option>
        <option value="sw">sw</option>
        <option value="" disabled>sw (leveled)</option>
      </select>
      <DiceEditor bind:dice={weapon.damage.base} />
    </div>
    <!-- (<input />)
    <input type="text" />
    <input type="text" /> -->
  </fieldset>
  <!-- <fieldset>
    <legend>Fragmentation</legend>
    (<input type="text" />)
    <input type="text" />
  </fieldset> -->
  <label>
    <span>Accuracy</span>
    <input type="text" bind:value={weapon.accuracy} />
  </label>
  <label>
    <span>Rate Of Fire</span>
    <input type="text" bind:value={weapon.rateOfFire} />
  </label>
  <label>
    <span>Range</span>
    <input type="text" bind:value={weapon.range} />
  </label>
  <label>
    <span>Recoil</span>
    <input type="text" bind:value={weapon.recoil} />
  </label>
  <label>
    <span>Shots</span>
    <input type="text" bind:value={weapon.shots} />
  </label>
  <label>
    <span>Bulk</span>
    <input type="text" bind:value={weapon.bulk} />
  </label>
</BaseForm>
