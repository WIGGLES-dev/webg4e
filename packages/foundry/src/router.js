import Sheet from "./Sheet.svelte"
const form = document.createElement("form")
export function sheetRouter(Base, map) {
  return class extends Base {
    get form() {
      return form
    }
    set form(value) {}
    constructor(...args) {
      super(...args)
      this.options.template = map[this.object.type]
    }
    static get defaultOptions() {
      return {
        ...super.defaultOptions,
        submitOnChange: false,
        submitOnClose: false,
        width: 1000,
        height: 750,
        classes: ["svelte"],
      }
    }
    render(...args) {
      if (this.rendered) {
      } else {
        return super.render(...args)
      }
    }
    async _renderInner() {
      const links = [
        "fonts/fontawesome/css/all.min.css",
        "systems/gurps4e/shadow.css",
      ].map((href) =>
        Object.assign(document.createElement("link"), {
          rel: "stylesheet",
          type: "text/css",
          media: "all",
          href,
        })
      )
      const wrapper = document.createElement("div")
      const target = wrapper.attachShadow({ mode: "open" })
      target.append(...links)
      this.component = new Sheet({
        target,
        props: {
          document: this.object,
          application: this,
        },
      })
      return jQuery(wrapper)
    }
    async close() {
      await super.close(...arguments)
      this.component.$destroy()
      this.component = null
    }
  }
}

export function documentRouter(Base, map) {
  return new Proxy(Base, {
    construct(target, args, newTarget) {
      const type = args[0].type
      if (type) {
        return new map[type](...args)
      }
      return new Base(...args)
    },
  })
}
