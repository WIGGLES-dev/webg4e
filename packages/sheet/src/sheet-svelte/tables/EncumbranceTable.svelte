<script lang="ts">
  import Popper from "../shared/Popper.svelte";
  export let el: number;
  export let bl: number;
  export let move: number;
  export let dodge: number;
  const levels = ["None", "Light", "Medium", "Heavy", "X-Heavy"];
  const encumbranceMax = (i: number) => {
    switch (i) {
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 3;
      case 3:
        return 6;
      case 4:
        return 10;
      default:
        return 10;
    }
  };
  const encumbranceFraction = (i: number) => {
    switch (i) {
      case 0:
        return 1;
      case 1:
        return 0.8;
      case 2:
        return 0.6;
      case 3:
        return 0.4;
      case 4:
        return 0.2;
      default:
        return 0.2;
    }
  };
</script>

<table>
  <caption>
    <slot name="caption">Encumbrance, Move & Dodge</slot>
  </caption>
  <thead>
    <tr>
      <th />
      <th>Level</th>
      <th>Max Load</th>
      <th>Move</th>
      <th>Dodge</th>
    </tr>
  </thead>
  <tbody>
    {#each levels as level, i}
      <Popper
        let:reference
        hideHovered={true}
        options={{ placement: "bottom", strategy: "absolute" }}
      >
        <tr class:bg-yellow-200={el === i} use:reference>
          <td>{el === i ? "*" : ""}</td>
          <td>({i}) {level}</td>
          <td>{Math.floor(bl * encumbranceMax(i))}</td>
          <td>{Math.floor(move * encumbranceFraction(i))}</td>
          <td>{Math.floor(dodge * encumbranceFraction(i))}</td>
        </tr>
        <div slot="popper">
          {#if i === 0}
            <p>
              You are at None if your equipped weight is less than Basic Lift.
              You take no penalties.
            </p>
          {:else if i === 1}
            <p>
              You are at Light if your equipped weight is above None and less
              than Basic Lift * 2.
            </p>
            <p>
              Your Move is multipled by 0.8x. All encumbrance sensitive skills
              and Dodge take a -1.
            </p>
          {:else if i === 2}
            <p>
              You are at Medium if your equipped weight is above Light and less
              than Basic Lift * 3.
            </p>
            <p>
              Your Move is multipled by 0.6x. All encumbrance sensitive skills
              and Dodge take a -2.
            </p>
          {:else if i === 3}
            <p>
              You are at Heavy if your equipped weight is above Medium and less
              than Basic Lift * 6.
            </p>
            <p>
              Your Move is multipled by 0.4x. All encumbrance sensitive skills
              and Dodge take a -3.
            </p>
          {:else if i === 4}
            <p>
              You are at Extra Heavy if your equipped weight is above Heavy and
              less than Basic Lift * 10.
            </p>
            <p>
              Your Move is multipled by 0.2x. All encumbrance sensitive skills
              and Dodge take a -4.
            </p>
            <p>
              This is the maximum weight you can carry over LONG periods of
              time. See "Carry On Back" in Lifting & Moving for short term
              weight.
            </p>
          {/if}
        </div>
      </Popper>
    {/each}
  </tbody>
</table>
