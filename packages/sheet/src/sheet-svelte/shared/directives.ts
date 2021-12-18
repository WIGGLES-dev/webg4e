export const fragment = (node: Element) => {
  node.parentElement?.parentElement?.append(node);
  return {
    destroy() {
      try {
        node.remove();
      } catch (err) {}
    },
  };
};
export const toRoot = (node: Element) => {
  node.getRootNode().appendChild(node);
  return {
    destroy() {
      try {
        node.remove();
      } catch (err) {}
    },
  };
};
