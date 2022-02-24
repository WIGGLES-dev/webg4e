Game.prototype._onPreventDragstart = function (event) {
  const target = event.target
  const hiddenTarget = event.composedPath()[0]
  if (target instanceof HTMLElement) {
    if (target.getAttribute("draggable") === "true") return true
  }
  if (hiddenTarget instanceof HTMLElement) {
    if (hiddenTarget.getAttribute("draggable") === "true") return true
  }
  event.preventDefault()
  return false
}
Object.defineProperties(KeyboardManager.prototype, {
  hasFocus: {
    get() {
      return (
        !!document.activeElement && document.activeElement !== document.body
      )
    },
  },
})

function updateSheetTitle(document, changes) {
  const { sheet } = document
  if (sheet.rendered && "name" in changes) {
    sheet.element.find(".window-title").text(changes.name)
  }
}

Hooks.on("updateActor", updateSheetTitle)
Hooks.on("updateItem", updateSheetTitle)
