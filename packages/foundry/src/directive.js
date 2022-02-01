export const shadow = (node, params) => {
  const shadow = node.attachShadow(params)
  requestAnimationFrame(() => {
    for (const child of Array.from(node.children)) {
      shadow.append(child)
    }
  })
  return {
    destroy() {
      try {
        node?.remove()
      } catch (err) {
        console.err(err)
      }
    },
    update(props) {},
  }
}
