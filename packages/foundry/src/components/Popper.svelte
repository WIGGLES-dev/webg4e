<script>
  import { afterUpdate, onDestroy } from "svelte"
  import { createPopper } from "@popperjs/core"
  export let placement = "top"
  export let strategy = "absolute"
  export let allowedAutoPlacements = undefined
  export let offset = [0, 0]
  export let modifiers = []
  export let referenceElement = undefined
  export let popperElement = undefined
  $: {
    if (referenceElement instanceof Event) {
      const { clientY, clientX } = referenceElement
      referenceElement = {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            top: clientY,
            right: clientX,
            bottom: clientY,
            left: clientX,
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
    if (!instance && referenceElement && popperElement) {
      instance = createPopper(referenceElement, popperElement, options)
    }
  }
  $: {
    if (instance && (referenceElement || popperElement || options)) {
      instance.state.elements.reference = referenceElement
      instance.state.elements.popper = popperElement
      instance.state.options = options
      instance.update()
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
        referenceElement = null
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
        popperElement = null
        instance?.destroy()
        instance = null
      },
    }
  }
  onDestroy(() => {
    instance?.destroy()
  })
</script>

<slot {popper} {reference} {referenceState} {instance} />
