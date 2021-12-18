<script lang="ts">
  import { render as renderLit } from "lit";
  export let template: unknown;
  let element: HTMLDivElement | undefined;
  $: if (element) {
    renderLit(template, element);
  }
</script>

<div class="contents" bind:this={element} />
