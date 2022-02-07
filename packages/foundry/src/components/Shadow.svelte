<script context="module">
  import { tick } from "svelte"
  import { portal } from "./Portal.svelte"
  export function shadow(node, params) {
    const wrapper = document.createElement("div")
    wrapper.style.display = "contents"
    const shadow = wrapper.attachShadow(params)
    let proxy
    ;(async () => {
      await tick()
      node.replaceWith(wrapper)
      wrapper.append(node)
      proxy = portal(node, { target: shadow, transplant: params.transplant })
    })()
    return {
      update: (params) => proxy?.update(params),
      destroy: () => {
        proxy?.destroy()
        wrapper.parentNode?.removeChild(wrapper)
      },
    }
  }
</script>

<script>
  export let mode = "open"
  export let transplant = false
</script>

<div use:shadow={{ mode, transplant }}>
  <slot />
</div>
