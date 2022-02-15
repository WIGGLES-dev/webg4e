function delegeInput(e) {
  const path = e.composedPath()
  const [target] = path
}
function delegateChange(e) {
  const path = e.composedPath()
  const [target] = path
}
async function delegateClick(e) {
  const path = e.composedPath()
  const [target] = path
  const dataset = path.find(
    (node) => node.dataset && "formula" in node.dataset
  )?.dataset
  if (e.shiftKey) return
  if (dataset) {
    const { formula, uuid } = dataset
    const document = await fromUuid(uuid)
    const data = document?.data?.data ?? {}
    new Roll(formula, data).toMessage()
  }
}

const handlers = {
  click: delegateClick,
  input: delegeInput,
  change: delegateChange,
}

export function delegate(target) {
  const entries = Object.entries(handlers)
  for (const [event, fn] of entries) {
    target.addEventListener(event, fn)
  }
  return () => {
    for (const [event, fn] of entries) {
      target.removeEventListener(event, fn)
    }
  }
}
