<script lang="ts">
  export let bl: number;
  const labels = [
    "Basic Lift",
    "One-Handed Lift",
    "Two-Handed Lift",
    "Shove & Knock Over",
    "Running Shove & Knock Over",
    "Carry On Back",
    "Shift Slightly",
  ];
  const liftMultiplier = (i: number) => {
    switch (i) {
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 8;
      case 3:
        return 12;
      case 4:
        return 24;
      case 5:
        return 15;
      case 6:
        return 50;
      default:
        return 50;
    }
  };
</script>

<div class="grid gap-1 grid-cols-2">
  <div class="col-span-2 bg-black text-white text-center">
    <slot name="caption">Lifting & Moving Things</slot>
  </div>
  {#each labels as label, i}
    <div class="text-right">{liftMultiplier(i) * bl} lb</div>
    <div>{label}</div>
  {/each}
</div>

<style lang="postcss">
</style>
