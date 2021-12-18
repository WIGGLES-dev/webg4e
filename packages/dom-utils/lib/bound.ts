export function bound(
  rect: DOMRect,
  { width = window.innerWidth, height = window.innerHeight }
): DOMRect {
  const x = Math.min(width - rect.width, rect.x);
  const y = rect.y > height - rect.height ? rect.y - rect.height : rect.y;
  const rv = { ...rect, x, y };
  return rv;
}
