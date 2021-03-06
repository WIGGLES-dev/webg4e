//@ts-ignore
Game.prototype._onPreventDragstart = function (event: DragEvent) {
  const target = event.target;
  const hiddenTarget = event.composedPath()[0];
  if (target instanceof HTMLElement) {
    if (target.getAttribute("draggable") === "true") return true;
  }
  if (hiddenTarget instanceof HTMLElement) {
    if (hiddenTarget.getAttribute("draggable") === "true") return true;
  }
  event.preventDefault();
  return false;
};
Object.defineProperties(KeyboardManager.prototype, {
  hasFocus: {
    get() {
      return (
        $(":focus").length > 0 ||
        (!!document.activeElement && document.activeElement !== document.body)
      );
    },
  },
});
