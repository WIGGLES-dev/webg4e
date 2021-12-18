<script lang="ts">
  import BaseForm from "./BaseForm.svelte";
  import ListControl from "./ListControl.svelte";
  import { Equipment } from "gurpsjs";
  export let equipment: Equipment;
</script>

<BaseForm>
  <label>
    <span>Name</span>
    <input type="text" name="name" bind:value={equipment.name} />
  </label>
  <label>
    <span>Quantity</span>
    <input type="number" name="quantity" bind:value={equipment.quantity} />
  </label>
  <label>
    <span>Tech Level</span>
    <input type="string" name="techLevel" bind:value={equipment.techLevel} />
  </label>
  <label>
    <span>Legality Class</span>
    <input
      type="string"
      name="techLevel"
      bind:value={equipment.legalityClass}
    />
  </label>
  <label>
    <span>Value</span>
    <input type="number" name="value" bind:value={equipment.value} />
  </label>
  <label>
    <span>Extended Value</span>
    <output>{equipment.eValue}</output>
  </label>
  <label>
    <span>Weight</span>
    <input type="number" name="weight" bind:value={equipment.weight} />
  </label>
  <label>
    <span>Extended Weight</span>
    <output>{equipment.eWeight}</output>
  </label>
  <label>
    <span>Notes</span>
    <input type="text" name="notes" bind:value={equipment.notes} />
  </label>
  <label>
    <span>Categories</span>
    <ListControl name="categories" bind:list={equipment.categories} />
  </label>
  <label>
    <span>Uses</span>
    <input type="number" name="uses" bind:value={equipment.uses} />
  </label>
  <label>
    <span>Max Uses</span>
    <input type="number" name="maxUses" bind:value={equipment.maxUses} />
  </label>
  <label>
    <span>Reference</span>
    <input type="text" name="reference" bind:value={equipment.reference} />
  </label>
</BaseForm>
