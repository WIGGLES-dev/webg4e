<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch =
    createEventDispatcher<{
      add: undefined;
    }>();
  function handleClick() {
    dispatch("add");
  }
</script>

<button on:click={handleClick}>
  <slot>+</slot>
</button>
