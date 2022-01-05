import { SvelteComponentTyped } from "svelte";
import { sharedOptions } from "../shared";

interface SvelteRenderable {
  rendered: boolean;
  render(force?: boolean, options?: Application.RenderOptions): unknown;
  close(options?: Application.CloseOptions): void;
}
export const svelteApp = <
  T extends abstract new (...args: any[]) => SvelteRenderable,
  C extends SvelteComponentTyped
>(
  Base: T,
  component: ConstructorOf<C>
) => {
  abstract class SvelteAppMixin extends Base {
    static get defaultOptions() {
      return {
        //@ts-ignore
        ...super.defaultOptions,
        ...sharedOptions,
      };
    }
    form = document.createElement("form");
    instance?: C;
    get shadowInit(): ShadowRootInit | false {
      return {
        mode: "open",
      };
    }
    get stylesheet(): string | undefined {
      return undefined;
    }
    constructor(...args: any[]) {
      super(...args);
    }
    abstract getProps(options?: Application.RenderOptions): C["$$prop_def"];
    getData(options: Application.RenderOptions = {}) {
      return this.getProps(options);
    }
    createMount(props: C["$$prop_def"]) {
      const div = document.createElement("div");
      div.style.display = "contents";
      try {
        let target: Node = div;
        const init = this.shadowInit;
        if (init) {
          target = div.attachShadow(init);
          const href = this.stylesheet;
          if (href) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            target.appendChild(link);
          }
        }
        this.instance = new component({
          target,
          props,
        });
      } catch (err) {
        console.error(err);
      }
      return div;
    }
    render(force?: boolean, options?: Application.RenderOptions): unknown {
      if (this.rendered) {
        this.instance?.$set(this.getProps(options));
        return this;
      } else {
        return super.render(force, options);
      }
    }
    async _renderInner(data: C["$$prop_def"]) {
      return $(this.createMount(data));
    }
    async close(options?: Application.CloseOptions): Promise<void> {
      const rv = await super.close(options);
      this.instance?.$destroy();
      this.instance = undefined;
      return rv;
    }
  }
  return SvelteAppMixin;
};
