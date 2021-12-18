<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch =
    createEventDispatcher<{
      trash: undefined;
    }>();
  function handleClick() {
    dispatch("trash");
  }
</script>

<button on:click={handleClick}>
  <slot>🗑</slot>
</button>
