export function getOffset(event, target) {
  if (event instanceof TouchEvent) {
    return getTouchOffset(event, target);
  }
  return getMouseOffset(event, target);
}

export function getMouseOffset(event, target = event.target) {
  // Cross-browser calculation of offsetY by Jack Moore, 2012.
  // https://www.jacklmoore.com/notes/mouse-position/
  // event.offsetX and event.offsetY breaks on Safari when zooming the canvas in.
  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  return { offsetX, offsetY };
}

export function getTouchOffset(event, target = event.target) {
  const rect = target.getBoundingClientRect();
  const touch = event.targetTouches[0];
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  return { offsetX, offsetY };
}

export function getClient(event) {
  if (event instanceof TouchEvent) {
    return {
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY,
    };
  }
  return {
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

/**
 * Get the target of the event, regardless of whether it was a mouse or touch
 * event.
 * @param {MouseEvent | TouchEvent} event The mouse or touch event.
 * @returns {Element} The target of the event.
 */
export function getTarget(event) {
  const { clientX, clientY } = getClient(event);
  return document.elementFromPoint(clientX, clientY);
}

export function getTargets(event) {
  const { clientX, clientY } = getClient(event);
  return document.elementsFromPoint(clientX, clientY);
}

export function distanceBetweenOffsets(A, B) {
  return Math.sqrt((A.offsetX - B.offsetX) ** 2 + (A.offsetY - B.offsetY) ** 2);
}
