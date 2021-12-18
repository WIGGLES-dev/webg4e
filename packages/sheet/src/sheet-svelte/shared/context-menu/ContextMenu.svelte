<script lang="ts" context="module">
  import { hasContext, getContext } from "svelte";
  export const contextSymbol = Symbol("Context Menu Context");
  export interface ContextMenuContext {
    close: () => void;
  }
  export function getContextMenuContext() {
    if (hasContext(contextSymbol)) {
      return getContext<ContextMenuContext>(contextSymbol);
    } else {
      throw new Error(
        "Cannot get context menu context outside of a context menu component"
      );
    }
  }
</script>

<script lang="ts">
  import { getOffset } from "dom-utils";
  import { createEventDispatcher, setContext } from "svelte";
  import ContextMenuOption from "./ContextMenuOption.svelte";
  const dispatch =
    createEventDispatcher<{
      close: undefined;
    }>();
  export let x: number;
  export let y: number;
  export let offset = { x: 4, y: 4 };
  export let open = false;
  const context: ContextMenuContext = {
    close,
  };
  setContext(contextSymbol, context);
  let ul: HTMLUListElement | undefined;
  $: if (ul) {
    const parentOffset = getOffset(ul);
    x += offset.x;
    y += offset.y;
    x -= parentOffset.x;
    y -= parentOffset.y;
    const rect = ul.getBoundingClientRect();
    x = Math.min(window.innerWidth - rect.width, x);
    if (y > window.innerHeight - rect.height) y -= rect.height;
  }
  function close() {
    if (open === true) {
      open = false;
      dispatch("close");
    }
  }
  function closeClick(e: MouseEvent) {
    const target = e.composedPath()[0] as HTMLElement;
    if (!ul?.contains(target)) {
      close();
    }
  }

  export function setTarget(node: Node, params: any) {
    return {
      update() {},
      destroy() {},
    };
  }
</script>

<svelte:window
  on:click={closeClick}
  on:contextmenu|capture={closeClick}
  on:scroll|capture={close}
/>
{#if open}
  <ul
    class="absolute bg-black text-white"
    bind:this={ul}
    style="top:{y}px; left:{x}px"
  >
    <slot />
  </ul>
{/if}

<style>
</style>
