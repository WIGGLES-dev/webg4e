<script>
  import { linearMeasurement } from "../formula.js"
  function displayMeasurement(number) {
    if (number > 2) {
      return `${number} yd`
    } else {
      return number
    }
  }
  export let lowerBound = -5
  export let upperBound = 10
  $: rows = new Array(Math.abs(lowerBound) + upperBound)
    .fill(0)
    .map((v, i) => i + lowerBound)
</script>

{#if upperBound > lowerBound}
  <table class="text-white">
    <caption>Size & Speed/Range Table</caption>
    <thead>
      <tr>
        <th class="text-center">Speed/Range</th>
        <th class="text-center">Size</th>
        <th>Linear Measurement</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as size, i (i)}
        <tr>
          <td class="text-center">{-Math.max(0, size)}</td>
          <td class="text-center">{size}</td>
          <td>{displayMeasurement(linearMeasurement(size))}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <!--  -->
{/if}

<style>
  th {
    @apply pr-3;
  }
</style>
