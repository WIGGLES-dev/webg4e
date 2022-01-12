import { ConfiguredDocumentClass } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import { SvelteComponent } from "svelte";

export function documentRouter<
  T extends
    | ConfiguredDocumentClass<typeof Actor>
    | ConfiguredDocumentClass<typeof Item>
>(Base: any, map: Record<string, T>) {
  return new Proxy(Base, {
    construct(target, args, newTarget) {
      const ctor = map[args[0].type];
      if (ctor) {
        return new ctor(args[0], args[1]);
      }
      return new Base(...args);
    },
  });
}

export function sheetRouter<Base extends new (...args: any[]) => DocumentSheet>(
  Base: Base & {
    defaultOptions: DocumentSheet.Options;
  },
  map: Record<string, typeof SvelteComponent>
) {
  const form = document.createElement("form");
  return class extends Base {
    form = form;
    svelteApp?: SvelteComponent;
    shadow?: ShadowRoot;
    cachedApp?: JQuery<HTMLElement>;
    static get defaultOptions(): DocumentSheet.Options {
      return {
        ...Base.defaultOptions,
        submitOnChange: false,
        submitOnClose: false,
      };
    }
    get component() {
      return map[this.object.data.type];
    }
    render(
      force?: boolean,
      options?: Application.RenderOptions<DocumentSheet.Options>
    ): this {
      if (!this.rendered) {
        super.render(force, options);
      }
      return this;
    }
    protected async _renderInner(
      data: DocumentSheet.Data<
        foundry.abstract.Document<any, any>,
        DocumentSheet.Options
      >
    ): Promise<JQuery<HTMLElement>> {
      if (this.cachedApp) return this.cachedApp;
      const element = document.createElement("div");
      if (!this.svelteApp) {
        this.shadow = element.attachShadow({ mode: "open" });
        this.svelteApp = new this.component({
          target: this.shadow,
          props: {
            //@ts-ignore
            [this.object.data.type]: this.object,
            application: this,
          },
        });
      }
      return (this.cachedApp = jQuery(element));
    }
  };
}
