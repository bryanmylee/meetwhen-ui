export function getTouchOffset(event) {
  // Cross-browser calculation of offsetY by Jack Moore, 2012.
  // https://www.jacklmoore.com/notes/mouse-position/
  // e.offsetX and e.offsetY breaks on Safari when zooming the canvas in.
  const { target } = event;
  const rect = target.getBoundingClientRect();
  const touch = event.targetTouches[0];
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  return { offsetX, offsetY };
}
