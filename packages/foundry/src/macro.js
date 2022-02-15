Hooks.on("ready", () => {
  game.system.executeMacro = async function (
    ctx,
    speaker,
    actor,
    token,
    character
  ) {
    const { uuid } = ctx
    const item = await fromUuid(uuid)
    if (item && item.type === "skill") {
      const formula = "3d6" + "ms" + item.model.level
      await new Roll(formula).toMessage()
    }
  }
})

Hooks.on("hotbarDrop", (hotbar, data, slot) => {})
Hooks.on("renderHotbar", (hotbar, element, dat) => {
  element = element.get(0)
  element.addEventListener("drop", (e) => {
    const data = e.dataTransfer.getData(`foundry/${game.system.id}/hotbar`)
    console.log(data)
  })
})

class MacroRecorder {
  constructor(target) {
    this.target = target
    this.#init()
  }
  #init() {
    const handlers = {
      click() {},
      dblclick() {},
      input() {},
      change() {},
    }
    for (const [event, fn] of Object.entries(handlers)) {
    }
  }
  attach() {
    return (node) => {}
  }
  finish() {
    return {
      type: "script",
      command: ``,
    }
  }
}
