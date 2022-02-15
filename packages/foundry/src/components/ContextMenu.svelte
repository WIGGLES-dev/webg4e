<script context="module">
  import ContextMenu from "./ContextMenu.svelte"
  import { get_root_for_style } from "svelte/internal"
  let menus = new Map()
  function getMenu(node) {
    const target = get_root_for_style(node)
    if (menus.has(target)) return menus.get(target)
    const menu = new ContextMenu({
      target,
    })
    menus.set(target, menu)
    return menu
  }
  export function render(options) {
    return function (event) {
      const menu = getMenu(event.target)
      menu.render({
        event,
        options,
      })
    }
  }
</script>

<script>
  import { createEventDispatcher, tick } from "svelte"
  import { createPopper } from "@popperjs/core"
  const dispatch = createEventDispatcher()
  export let event = undefined
  export let options = []
  let open = false
  export async function render({ options: _options, event: _event }) {
    if (open) {
      open = false
      await tick()
    }
    event = _event
    options = _options
    open = true
  }
  export function close() {
    open = false
    dispatch("close")
  }
  const ve = (e) => {
    return {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX,
        }
      },
    }
  }
  const poppify = (node) => {
    const instance = createPopper(ve(event), node, {
      placement: "right-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [8, 8],
          },
        },
      ],
    })
    return {
      destroy() {
        instance.destroy()
      },
    }
  }
</script>

<svelte:window on:click={close} />

{#if open}
  <ul use:poppify class="bg-white text-black absolute" style:z-index="1000">
    {#each options as option, i}
      {#if option instanceof Array}
        <!--  -->
      {:else}
        <li
          class:disabled={option.can === false}
          class:warn={option.warn}
          class="p-3 hover:bg-green-500 hover:text-white {option.class || ''}"
          on:click|capture|stopPropagation={() => {
            if (option.can !== false) {
              option.click()
              close()
            }
          }}
        >
          <slot {option}>{option.label}</slot>
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style>
  .disabled {
    @apply bg-gray-400 text-white;
  }
  .warn {
    @apply bg-red-400 text-white hover:bg-red-600;
  }
</style>
