export function getOffset(element: HTMLElement): { x: number; y: number } {
  let offsetParent = element.offsetParent;
  if (
    offsetParent != null &&
    offsetParent !== document.body &&
    offsetParent instanceof HTMLElement
  ) {
    const nextOffset = getOffset(offsetParent);
    const x = offsetParent.offsetLeft + nextOffset.x;
    const y = offsetParent.offsetTop + nextOffset.y;
    return {
      x,
      y,
    };
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
}
