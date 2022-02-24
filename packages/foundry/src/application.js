export const SvelteApplicationMixin = (Application) =>
  class extends Application {
    static get defaultOptions() {
      return {
        ...super.defaultOptions,
        width: 1000,
        height: 750,
        classes: ["svelte", "tailwind"],
      }
    }
    get component() {
      return this.options.component
    }
    constructor(object, options) {
      super(options)
      this.object = object
    }
    render() {
      if (this.rendered) {
      } else {
        super.render(...arguments)
      }
    }
    async _renderInner() {
      const wrapper = document.createElement("div")
      let target = this.options.shadow
        ? wrapper.attachShadow(this.options.shadow)
        : wrapper
      if ("shadow" in this.options) {
        const links = this.options.links?.map((href) =>
          Object.assign(document.createElement("link"), {
            href,
            rel: "stylesheet",
            media: "all",
            type: "text/css",
          })
        )
        target.append(...links)
      }
      let component = this.component
      if (typeof component === "string")
        component = (await import(component)).default
      this.instance = new component({
        target,
        props: this.getData(),
      })
      return jQuery(wrapper)
    }
    async close() {
      await super.close(...arguments)
      this.instance?.$destroy()
      this.instance = null
    }
    getData() {
      return {
        application: this,
        ...this.object,
      }
    }
    on(hook, cb) {
      Hooks.on(`${hook}${this.constructor.name}`, (app, ...args) => {
        if (app === this) {
          cb(app, ...arguments)
        }
      })
    }
  }

export class SvelteApplication extends SvelteApplicationMixin(Application) {}

const openApps = new Set()
export function openApp({ props = {}, options }, once = true) {
  if (once) {
    if (openApps.has(options.component)) return
    openApps.add(options.component)
  }
  const app = new SvelteApplication(
    {
      ...props,
    },
    {
      ...options,
    }
  )
  app.on("close", () => {
    openApps.delete(options.component)
  })
  app.render(true)
}
