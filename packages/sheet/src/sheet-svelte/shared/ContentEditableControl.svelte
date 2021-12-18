<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let multiline = false;
  export let type: "text" | "number";
  export let value: string | number;
  let element: HTMLDivElement | undefined;
  let classList = "";
  let focused = false;
  export { classList as class };
  const dispatch =
    createEventDispatcher<{
      input: string | number;
    }>();
  const onKeydown = (e: KeyboardEvent) => {
    if (multiline) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }
    if (type === "number") {
      switch (e.key) {
        case "ArrowDown": {
          value = +value - 1;
          dispatch("input", value);
          break;
        }
        case "ArrowUp": {
          value = +value + 1;
          dispatch("input", value);
          break;
        }
      }
    }
  };
  const onBeforeInput = (e: Event) => {
    const target = e.target as HTMLDivElement;
    if (e instanceof InputEvent) {
      if (type === "number") {
        const data = e.data;
        const { textContent } = target;
        if (data) {
          const nv = +(textContent?.trim() ?? "" + data.trim());
          if (Number.isNaN(nv)) {
            e.preventDefault();
          }
        }
      }
    }
  };
  function handleInput(e: Event) {
    const target = e.target as HTMLDivElement;
    const textContent = target.textContent || "";
    value = type === "number" ? +textContent : textContent;
    dispatch("input", value);
  }
</script>

<div
  on:keydown={onKeydown}
  bind:this={element}
  contenteditable="true"
  on:beforeinput={onBeforeInput}
  on:input={handleInput}
>
  {value}
</div>

<style lang="postcss" class={classList}>
  /* div {
    @apply text-blue-500 border-b;
  } */
</style>
