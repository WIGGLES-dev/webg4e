import Sheet from "./Sheet.svelte"
import { SYSTEM_LINKS } from "./constants.js"

export function sheetRouter(Base, map, options = {}) {
  return class SystemSheet extends Base {
    constructor() {
      super(...arguments)
      this.options.template = map[this.object.type]
    }
    static get defaultOptions() {
      return {
        ...super.defaultOptions,
        width: 1000,
        height: 750,
        classes: ["svelte", "tailwind"],
        ...options,
      }
    }
    render(...args) {
      if (this.rendered) {
      } else {
        return super.render(...args)
      }
    }
    activateListeners(html) {
      super.activateListeners(html)
    }
    async _renderInner() {
      this.form = document.createElement("form")
      const target = this.form
      this.component = new Sheet({
        target,
        props: {
          document: this.object,
          application: this,
        },
      })
      return jQuery(this.form)
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
