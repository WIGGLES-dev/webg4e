<script lang="ts">
  import { onDestroy, afterUpdate, onMount, tick } from "svelte";
  import {
    createPopper,
    Instance,
    OptionsGeneric,
    Modifier,
    VirtualElement,
  } from "@popperjs/core";
  import { toRoot } from "./directives";
  export let options:
    | Partial<OptionsGeneric<Partial<Modifier<any, any>>>>
    | undefined = undefined;
  let hovered = false;
  export let hideHovered = false;
  export let offset: [number, number] = [0, 0];
  $: showing = hideHovered ? hovered === true : true;
  let instance: Instance | undefined;
  export let referenceElement: HTMLElement | VirtualElement | undefined =
    undefined;
  let popperElement: HTMLDivElement | undefined;
  function onMouseEnter() {
    hovered = true;
  }
  function onMouseLeave() {
    hovered = false;
  }
  function reference(element: HTMLElement) {
    referenceElement = element;
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
    return {
      destroy() {
        instance?.destroy();
        instance = undefined;
        referenceElement = undefined;
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
      },
    };
  }
  $: if (instance && referenceElement) {
    if (instance.state.elements.reference !== referenceElement) {
      instance.state.elements.reference = referenceElement;
      instance.update();
    }
  }
  $: if (!instance && referenceElement && popperElement) {
    const modifiers = options?.modifiers ?? [];
    modifiers.push({
      name: "offset",
      options: { offset },
    });
    instance = createPopper(referenceElement, popperElement, {
      ...options,
      modifiers,
    });
  }
  afterUpdate(async () => {
    await instance?.update();
  });
  onDestroy(() => {
    instance?.destroy();
  });
</script>

<slot {reference} />

<div use:toRoot bind:this={popperElement}>
  {#if showing}
    <div class="tooltip">
      <slot name="popper" />
    </div>
  {/if}
</div>

<style lang="postcss">
  .tooltip {
    @apply bg-black text-white min-w-min p-3;
  }
</style>
