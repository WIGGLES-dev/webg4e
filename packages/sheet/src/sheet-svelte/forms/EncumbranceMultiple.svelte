<script lang="ts">
  export let encumbranceMultiple: number;
  export let maxMultiple = 9;
  const formatEncumbranceLabel = (i: number) => {
    if (i === 0) return "No penalty due to encumbrance";
    let string = "Penalty equal to";
    if (i === 1) string += "encumbrance";
    if (i > 1) string += ` ${i} times encumbrance`;
    return string;
  };
  export let name = "";
</script>

<select {name}>
  {#each new Array(maxMultiple).fill(undefined) as _, i}
    <option value={i}>
      <slot {i}>
        {formatEncumbranceLabel(i)}
      </slot>
    </option>
  {/each}
</select>
