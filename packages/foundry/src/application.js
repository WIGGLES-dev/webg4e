export class SvelteApplication extends Application {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      width: 1000,
      height: 750,
      classes: ["svelte"],
    }
  }
  get component() {
    return this.options.component
  }
  constructor(props, options) {
    super(options)
    this.props = props
  }
  render() {
    if (this.rendered) {
    } else {
      super.render(...arguments)
    }
  }
  async _renderInner() {
    const wrapper = document.createElement("div")
    const target = wrapper.attachShadow({ mode: "open" })
    const links = this.options.links?.map((href) =>
      Object.assign(document.createElement("link"), {
        href,
        rel: "stylesheet",
        media: "all",
        type: "text/css",
      })
    )
    target.append(...links)
    this.instance = new this.component({
      target,
      props: this.getData(),
    })
    return jQuery(wrapper)
  }
  async close() {
    await super.close(...arguments)
    this.instance.$destroy()
    this.instance = null
  }
  getData() {
    return this.props
  }
  on(hook, cb) {
    Hooks.on(`${hook}${this.constructor.name}`, (app, ...args) => {
      if (app === this) {
        cb(app, ...arguments)
      }
    })
  }
}
