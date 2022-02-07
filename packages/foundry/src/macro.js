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
