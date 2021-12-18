<script lang="ts">
  import { SelfControlRoll, selfControlString } from "gurpsjs";
  export let cr: SelfControlRoll;
  export let name = "";
  const ratings = [
    SelfControlRoll.Never,
    SelfControlRoll.Rarely,
    SelfControlRoll.FairlyOften,
    SelfControlRoll.QuiteOften,
    SelfControlRoll.AlmostAllOfTheTime,
    SelfControlRoll.NoneRequired,
  ];
</script>

<select {name} bind:value={cr}>
  {#each ratings as rating}
    <option value={rating}>
      <slot {rating}>{selfControlString(rating)} </slot>
    </option>
  {/each}
</select>
