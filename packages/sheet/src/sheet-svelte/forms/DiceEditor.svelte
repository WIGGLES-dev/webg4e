<script lang="ts">
  import { Dice } from "gurpsjs";
  export let dice: Dice;
  export let name = "";
  function setDice(this: HTMLInputElement) {
    dice = Dice.fromString(this.value);
  }
</script>

<input type="text" {name} on:change={setDice} value={dice.toString()} />
