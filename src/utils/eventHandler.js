export function getMouseOffset(event) {
  // Cross-browser calculation of offsetY by Jack Moore, 2012.
  // https://www.jacklmoore.com/notes/mouse-position/
  // event.offsetX and event.offsetY breaks on Safari when zooming the canvas in.
  const { target } = event;
  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  return { offsetX, offsetY };
}

export function getTouchOffset(event) {
  const { target } = event;
  const rect = target.getBoundingClientRect();
  const touch = event.targetTouches[0];
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  return { offsetX, offsetY };
}

export function distanceBetweenOffsets(A, B) {
  return Math.sqrt((A.offsetX - B.offsetX) ** 2 + (A.offsetY - B.offsetY) ** 2);
}
