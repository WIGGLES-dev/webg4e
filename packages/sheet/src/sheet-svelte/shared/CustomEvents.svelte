<script lang="ts">
  import { onMount } from "svelte";
  let element: HTMLDivElement | undefined;
  export let event: string;
  export let handler: <T>(event: CustomEvent<T>) => void;
  onMount(() => {
    if (element instanceof HTMLDivElement) {
      element.addEventListener(event, handler);
    }
  });
</script>

<div class="contents" bind:this={element}>
  <slot />
</div>
