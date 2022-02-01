import App from "./components/App.svelte"
const form = document.createElement("form")
export function sheetRouter(Base, map) {
  return class extends Base {
    get form() {
      return form
    }
    set form(value) {}
    constructor(...args) {
      super(...args)
    }
    static get defaultOptions() {
      return {
        ...super.defaultOptions,
        submitOnChange: false,
        submitOnClase: false,
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
    createStyleLink(href) {
      const link = document.createElement("link")
      link.href = href
      link.rel = "stylesheet"
      link.type = "text/css"
      link.media = "all"
      return link
    }

    async _renderInner(...args) {
      const target = document.createElement("div")
      const shadow = target.attachShadow({ mode: "open" })
      shadow.append(this.createStyleLink("fonts/fontawesome/css/all.min.css"))
      shadow.append(this.createStyleLink("systems/gurps4e/main.css"))
      this.component = new App({
        target: shadow,
        props: {
          map,
          document: this.document,
          application: this,
        },
      })
      this.cache = $(target)
      if (this.cache) return this.cache
      return super._renderInner(...args)
    }
    async close(...args) {
      await super.close(...args)
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
