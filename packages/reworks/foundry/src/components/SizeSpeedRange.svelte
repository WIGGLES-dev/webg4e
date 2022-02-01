<script>
  function speedRange(distance) {
    const penalty = Math.round(2 - 6 * Math.log10(distance))
    return Math.min(0, penalty)
  }
  function size(length) {
    return 6 * Math.log10(length) - 2
  }
  function linearMeasurement(size) {
    if (size >= 0) {
      // 2,3,5,7,10,15
      const step = Math.floor(size / 6)
      const round = size - step * 6
      const pow = Math.pow(10, step + 1)
      switch (round) {
        case 0:
          return 2 * pow
        case 1:
          return 3 * pow
        case 2:
          return 5 * pow
        case 3:
          return 7 * pow
        case 4:
          return 10 * pow
        case 5:
          return 15 * pow
      }
    } else {
      return 0
    }
  }
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
