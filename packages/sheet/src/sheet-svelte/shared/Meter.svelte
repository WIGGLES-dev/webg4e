<script lang="ts">
  export let min: number = 0;
  export let max: number | undefined = undefined;
  export let low: number | undefined = undefined;
  export let high: number | undefined = undefined;
  export let optimum: number | undefined = undefined;
  export let value: number = 0;
  export let color: string = "red";
  export let classList = "";
  export { classList as class };
</script>

<meter
  class={classList}
  {min}
  {max}
  {low}
  {high}
  {optimum}
  {value}
  style="
    --optimum-value-color: {color || 'red'};
  "
/>

<style lang="postcss">
  meter::-webkit-meter-optimum-value {
    background: var(--optimum-value-color);
  }
  meter::-webkit-meter-optimum-value,
  meter::-webkit-meter-suboptimum-value,
  meter::-webkit-meter-even-less-good-value {
    transition: 1s width;
  }
</style>
