<script context="module">
  import { tick } from "svelte"
  import { get_root_for_style } from "svelte/internal"
  /**
   * Usage: <div use:portal={'css selector'}> or <div use:portal={document.body}>
   *
   * @param {HTMLElement} el
   * @param {HTMLElement|string} target DOM Element or CSS Selector
   */
  export function portal(el, target = "body") {
    const onDestroy = []
    let targetEl
    async function update(newTarget) {
      let transplant = false
      if (typeof newTarget === "object") {
        target = newTarget.target
        transplant = newTarget.transplant
      }
      target = newTarget
      if (typeof target === "string") {
        targetEl = document.querySelector(target)
        if (targetEl === null) {
          await tick()
          targetEl = document.querySelector(target)
        }
        if (targetEl === null) {
          throw new Error(`No element found matching css selector: "${target}"`)
        }
      } else if (
        target instanceof HTMLElement ||
        target instanceof ShadowRoot
      ) {
        targetEl = target
      } else if (typeof target === "function") {
        targetEl = target(el)
      } else {
        throw new TypeError(
          `Unknown portal target type: ${
            target === null ? "null" : typeof target
          }. Allowed types: string (CSS selector) or HTMLElement.`
        )
      }
      const oldRoot = get_root_for_style(el)
      const newRoot = get_root_for_style(targetEl)
      const sameRoot = oldRoot.isSameNode(newRoot)
      if (sameRoot === false && transplant) {
        const links = oldRoot.querySelectorAll("link[rel=stylesheet]")
        const styles = oldRoot.querySelectorAll("style")
        const clonedNodes = Array.from(links)
          .concat(...Array.from(styles))
          .map((node) => node.cloneNode(true))
        newRoot.append(...clonedNodes)
        onDestroy.push(() => {
          for (const node of clonedNodes) {
            node.parentNode?.removeChild(node)
          }
        })
      }
      targetEl.appendChild(el)
      el.hidden = false
    }
    function destroy() {
      el.parentNode?.removeChild(el)
      for (const cb of onDestroy) {
        cb()
      }
    }
    update(target)
    return {
      update,
      destroy,
    }
  }
</script>

<script>
  import {} from "svelte/internal"
  /**
   * DOM Element or CSS Selector
   * @type { HTMLElement|string}
   */
  export let target = "body"
  export let transplant = false
</script>

<div use:portal={{ target, transplant }} hidden>
  <slot />
</div>
