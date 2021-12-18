<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import BaseForm from "../forms/BaseForm.svelte";
  import { SpeedRange } from "gurpsjs";
  const dispatch =
    createEventDispatcher<{
      roll: {
        modifier: number;
        target: number;
      };
    }>();
  let target = 10;
  let attackType: "melee" | "ranged" = "melee";
  $: melee = attackType === "melee";
  $: ranged = attackType === "ranged";
  let deceptiveAttacks = 0;
  let evaluate = 0;
  let range = 0;
  let accuracy = 0;
  let turnsAimed = 0;
  let modifier = 0;
  $: {
    let mod = 0;
    switch (attackType) {
      case "melee": {
        mod += deceptiveAttacks * -2;
        mod += evaluate;
        break;
      }
      case "ranged": {
        mod += SpeedRange.rangePenalty(range);
        if (turnsAimed > 0) mod += accuracy;
        mod += Math.max(turnsAimed - 1, 0);
        break;
      }
    }
    modifier = mod;
  }
</script>

<BaseForm>
  <label>
    <span>Target</span>
    <input type="number" bind:value={target} />
  </label>
  <label>
    <span>Attack Type</span>
    <select bind:value={attackType}>
      <option value="melee">Melee</option>
      <option value="ranged">Ranged</option>
    </select>
  </label>
  {#if melee}
    <label>
      <span>Deceptive Attack</span>
      <input type="number" bind:value={deceptiveAttacks} />
    </label>
    <label>
      <span>Evaluate</span>
      <input type="number" bind:value={evaluate} />
    </label>
  {/if}
  {#if ranged}
    <label>
      <span>Range</span>
      <input type="number" bind:value={range} />
    </label>
    <label>
      <span>Weapon Accuracy</span>
      <input type="number" bind:value={accuracy} />
    </label>
    <label>
      <span>Turns Aimed</span>
      <input type="number" bind:value={turnsAimed} />
    </label>
  {/if}
  <label>
    <span>Modifier</span>
    <output>{modifier}</output>
  </label>
  <label>
    <span>Need</span>
    <output>{target + modifier}</output>
  </label>
  <menu class="col-span-2">
    <button on:click={() => dispatch("roll", { modifier, target })}>
      Roll
    </button>
  </menu>
</BaseForm>
