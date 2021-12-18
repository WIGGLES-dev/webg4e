<script lang="ts">
  export let tag = "div";
  export let el = document.createElement(tag);
  export let listen: Record<string, (e: Event) => void> = {};
  function replace(node: HTMLDivElement) {
    el.append(...Array.from(node.childNodes));
    node.replaceWith(el);
    return {
      destroy() {
        try {
          node.remove();
        } catch (err) {}
      },
    };
  }
</script>

<div use:replace>
  <slot {el} />
</div>
