const form = document.createElement("form")
export function router(Base, map) {
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
      link.medio = "all"
      return link
    }
    async _renderInner(...args) {
      const type = this.document.data.type
      const app = map[type]
      if (app && !this.component) {
        const target = document.createElement("div")
        const shadow = target.attachShadow({ mode: "open" })
        shadow.append(this.createStyleLink("systems/gurps4e/style.css"))
        shadow.append(this.createStyleLink("fonts/fontawesome/css/all.min.css"))
        if (app) {
          this.component = new app({
            target: shadow,
            props: {
              [type]: this.document,
              application: this,
            },
          })
        }
        this.cache = $(target)
      }
      if (this.cache) return this.cache
      return super._renderInner(...args)
    }
  }
}
