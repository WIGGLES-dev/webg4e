<script lang="ts">
  import { getContextMenuContext } from "./ContextMenu.svelte";
  import { createEventDispatcher } from "svelte";
  const { close } = getContextMenuContext();
  const dispatch =
    createEventDispatcher<{
      select: undefined;
    }>();
  export let label = "";
  export let visible = true;
  export let active = true;
  function handleClick(this: HTMLLIElement, e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    ) {
    } else if (active) {
      dispatch("select");
      close();
    }
  }
</script>

{#if visible}
  <li on:click={handleClick}>
    <div class="p-2 hover:bg-white hover:text-black">
      <slot>{label}</slot>
    </div>
  </li>
{/if}
