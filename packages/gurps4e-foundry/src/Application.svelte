<script lang="ts" context="module">
  import { TailwindProvider } from "sheet";
  import { onMount, SvelteComponentTyped } from "svelte";
  export interface ApplicationComponent<
    T extends SvelteComponentTyped = SvelteComponentTyped
  > {
    component: ConstructorOf<T>;
    props: T["$$prop_def"];
    events?: {
      [K in keyof T["$$events_def"]]?: (e: T["$$events_def"][K]) => void;
    };
  }
  class SvelteApplication extends Application {
    private wrapperNode = document.createElement("div");
    private shadow = this.wrapperNode.attachShadow({ mode: "open" });
    instance?: SvelteComponentTyped;
    constructor(options: Application.Options) {
      super(options);
    }
    get error() {
      const pre = document.createElement("pre");
      pre.textContent = `
        Failed to render svelte application
      `;
      return pre;
    }
    async _renderInner(data: any) {
      return jQuery(this.wrapperNode);
    }

    mount(node: HTMLElement, component: ApplicationComponent) {
      this.shadow.append(node);
      this.instance = new TailwindProvider({
        target: node,
        //@ts-ignore
        props: component,
      });
      return {
        update: (component: ApplicationComponent) => {
          this.instance?.$set(component);
        },
        destroy: () => {
          try {
            node.remove();
            this.instance?.$destroy();
          } catch (err) {
            //
          }
          this.close();
        },
      };
    }
  }
</script>

<script lang="ts">
  let root: HTMLDivElement | undefined;
  let classList = "";
  export { classList as class };
  export let component: ApplicationComponent;
  export let rendered = false;
  export let options = {
    width: 750,
    height: 750,
    resizable: true,
    classes: ["valor"],
  } as Application.Options;
  let mergedOptions = {
    ...Application.defaultOptions,
    ...options,
  };
  const application = new SvelteApplication(mergedOptions);
  const hook = `close${SvelteApplication.name}`;
  function onCloseApplication(app: SvelteApplication, el: JQuery) {
    if (app === application) {
      rendered = false;
    }
  }
  onMount(() => {
    Hooks.on(hook, onCloseApplication);
    return () => Hooks.off(hook, onCloseApplication);
  });
  $: {
    if (rendered === true) {
      application.render(true);
    } else {
      application.close();
    }
  }
</script>

{#if rendered}
  <div class={classList} bind:this={root} use:application.mount={component}>
    <slot>
      <!--  -->
    </slot>
  </div>
{/if}
