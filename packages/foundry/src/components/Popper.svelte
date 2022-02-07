<script>
  import { afterUpdate } from "svelte"
  import { createPopper } from "@popperjs/core"
  export let placement
  export let strategy = "absolute"
  export let allowedAutoPlacements
  export let offset = [0, 0]
  export let modifiers = []
  export let virtual = false
  let virtualElement
  let referenceElement
  let popperElement
  $: {
    if (virtual) {
      virtualElement = {
        getBoundingClientRect() {
          if (reference instanceof HTMLElement) {
            return reference.getBoundingClientRect()
          }
        },
      }
    }
  }
  $: options = {
    strategy,
    placement,
    allowedAutoPlacements,
    modifiers: [
      {
        name: "offset",
        options: {
          offset,
        },
      },
      ...modifiers,
    ],
  }
  let instance
  $: {
    if (!instance && (virtualElement || referenceElement) && popperElement) {
      instance = createPopper(
        virtualElement || referenceElement,
        popperElement,
        options
      )
    }
  }
  $: {
    if (instance && (virtualElement || referenceElement) && popperElement) {
    }
  }
  $: referenceState = {
    hovered: false,
    entered: null,
    left: null,
  }
  afterUpdate(() => {
    instance?.update()
  })
  function reference(node) {
    const events = {
      mouseenter(e) {
        referenceState.hovered = true
        referenceState.entered = true
        referenceState.left = false
      },
      mouseleave(e) {
        referenceState.hovered = false
        referenceState.entered = false
        referenceState.left = true
      },
    }
    for (const [event, fn] of Object.entries(events)) {
      node.addEventListener(event, fn)
    }
    referenceElement = node
    return {
      destroy() {
        for (const [event, fn] of Object.entries(events)) {
          node.removeEventListener(event, fn)
        }
        instance?.destroy()
        instance = null
      },
    }
  }
  function popper(node) {
    popperElement = node
    return {
      update() {},
      destroy() {
        instance?.destroy()
        instance = null
      },
    }
  }
</script>

<slot {popper} {reference} {referenceState} {instance} />
