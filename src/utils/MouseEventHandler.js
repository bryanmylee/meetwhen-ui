export function getMouseOffset(e) {
  // Cross-browser calculation of offsetY by Jack Moore, 2012.
  // https://www.jacklmoore.com/notes/mouse-position/
  // e.offsetX and e.offsetY breaks on Safari when zooming the canvas in.
  const { target } = e;
  const rect = target.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  return { offsetX, offsetY };
}