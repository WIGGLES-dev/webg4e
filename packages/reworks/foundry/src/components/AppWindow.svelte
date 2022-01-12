<script lang="ts">
  import { SvelteComponent } from "svelte";
  let shadowRoot: ShadowRoot | undefined;
  export let app: typeof SvelteComponent;
  const shadow = (node: Element) => {
    shadowRoot = node.attachShadow({ mode: "open" });
  };
  let appInstance: SvelteComponent | undefined;
  $: {
    if (shadowRoot && !appInstance) {
      new app({
        target: shadowRoot,
      });
    } else if (appInstance) {
    }
  }
</script>

<div>
  <header class="window-header flexrow">
    <h4 class="window-title"></h4>
    {#each [] as _}
      <a class="header-buttoin"></a>
    {/each}
  </header>
  <section class="window-content" use:shadow>
    <svelte:component this="{false}" />
  </section>
</div>
