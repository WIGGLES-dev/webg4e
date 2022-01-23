<script context="module">
  const menus = new Set()
  import ContextMenu from "./ContextMenu.svelte"
  export function render(options) {
    return function (event) {
      const target = event.target.getRootNode()
      new ContextMenu({
        target,
        props: {
          event,
          options,
        },
      })
    }
  }
</script>

<script>
  import { createPopper } from "@popperjs/core"
  import { get_current_component } from "svelte/internal"
  for (const menu of menus) {
    menu.$destroy()
  }
  const component = get_current_component()
  menus.clear()
  menus.add(component)
  export let event
  export let options
  function globalclick(e) {
    component.$destroy()
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

<style>
  .contextmenu {
  }
</style>

<svelte:window on:click="{globalclick}" />
<ul
  use:poppify
  class="context-menu bg-white text-black absolute"
  style:z-index="1000">
  {#each options as option, i}
    <li
      class="p-3 hover:bg-green-500 hover:text-white"
      on:click|capture|stopPropagation="{() => {
        option.click()
        component.$destroy()
      }}">
      <slot {option}>{option.label}</slot>
    </li>
  {/each}
</ul>
