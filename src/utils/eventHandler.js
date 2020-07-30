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

/**
 * Get the target of the event, regardless of whether it was a mouse or touch
 * event.
 * @param {MouseEvent | TouchEvent} event The mouse or touch event.
 * @returns {Element} The target of the event.
 */
export function getTarget(event) {
  if (event instanceof TouchEvent) {
    return getTouchTarget(event);
  }
  return event.target;
}

function getTouchTarget(event) {
  const { clientX, clientY } = event.changedTouches[0];
  return document.elementFromPoint(clientX, clientY);
}

export function distanceBetweenOffsets(A, B) {
  return Math.sqrt((A.offsetX - B.offsetX) ** 2 + (A.offsetY - B.offsetY) ** 2);
}
