<script lang="ts">
  import BaseForm from "./BaseForm.svelte";
  import { Advantage } from "gurpsjs";
  import ListControl from "./ListControl.svelte";
  import CRSelect from "./CRSelect.svelte";
  export let advantage: Advantage;
</script>

<BaseForm>
  <label>
    <span>Name</span>
    <input type="text" name="name" bind:value={advantage.name} />
  </label>
  <label>
    <span>Enabled</span>
    <input type="checkbox" name="enabled" bind:checked={advantage.enabled} />
  </label>
  <label>
    <span> Base Point Cost </span>
    <input type="number" name="points" bind:value={advantage.points} />
  </label>
  <label>
    <span>Has Level</span>
    <input type="checkbox" name="hasLevels" bind:checked={advantage.hasLevels} />
  </label>
  <label>
    <span>Levels</span>
    <input
      type="number"
      name="levels"
      bind:value={advantage.levels}
      disabled={!advantage.hasLevels}
    />
  </label>
  <label>
    <span>Point Cost Per Level</span>
    <input
      type="number"
      name="pointsPerLevel"
      bind:value={advantage.pointsPerLevel}
      disabled={!advantage.hasLevels}
    />
  </label>
  <label>
    <span>Round Down</span>
    <input
      type="checkbox"
      name="roundCostDown"
      checked={advantage.roundCostDown}
    />
  </label>
  <label>
    <span>Total</span>
    <output>{advantage.getAdjustedPoints()}</output>
  </label>
  <label>
    <span>Notes</span>
    <input type="text" name="notes" value={advantage.notes} />
  </label>
  <label>
    <span>Categories</span>
    <ListControl name="categories" bind:list={advantage.categories} />
  </label>
  <label>
    <span>CR</span>
    <CRSelect name="cr" bind:cr={advantage.cr} />
  </label>
  <fieldset class="flex justify-between">
    <label>
      <span>Mental</span>
      <input type="checkbox" name="isMental" bind:checked={advantage.isMental} />
    </label>
    <label>
      <span>Physical</span>
      <input type="checkbox" name="isPhysical" bind:checked={advantage.isPhysical} />
    </label>
    <label>
      <span>Social</span>
      <input type="checkbox" name="isSocial" bind:checked={advantage.isSocial} />
    </label>
    <label>
      <span>Exotic</span>
      <input type="checkbox" name="isExotic" bind:checked={advantage.isExotic} />
    </label>
    <label>
      <span>Supernatural</span>
      <input
        type="checkbox"
        name="isSupernatural"
        bind:checked={advantage.isSupernatural}
      />
    </label>
  </fieldset>
  <label>
    <span>Ref</span>
    <input type="text" name="reference" bind:value={advantage.reference} />
  </label>
</BaseForm>
