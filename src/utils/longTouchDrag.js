import { getTouchOffset, distanceBetweenOffsets } from 'src/utils/eventHandler';

/**
 * A custom long touch and dragging handler to enable dragging actions on scrolling elements.
 * @param {HTMLElement} node The node to attach the action to.
 * @param {{
 *   onDragStart: Function,
 *   onDragMove: Function,
 *   onDragEnd: Function,
 *   onNoDragEnd?: Function,
 *   duration?: number,
 *   moveSens?: number,
 * }} options
 * @param options.onDragStart The callback for when the touch drag event
 * starts.
 * @param options.onDragMove The callback for when the touch event is moved
 * while dragging.
 * @param options.onDragEnd The callback for when the touch drag event ends.
 * @param options.duration The number of milliseconds after the touch event
 * starts before the drag event is triggered.
 * @param options.moveSens The number of pixels the touch event is allowed to
 * move without cancelling the drag event. This allows the long touch drag to be
 * used on scrollable elements, as the drag event will not be triggered if the
 * touch moves too far, defaulting to a scroll event instead.
 */
export default function longTouchDrag(node, {
  onDragStart, onDragMove, onDragEnd, onNoDragEnd = null,
  duration = 200, moveSens = 5,
}) {
  let timer = null;
  let initialOffset = null;
  let moved = false;
  let selecting = false;

  node.addEventListener('touchstart', touchStart);

  function touchStart(event) {
    initialOffset = getTouchOffset(event);
    timer = setTimeout(() => checkLongPress(event), duration);

    node.addEventListener('touchmove', touchMove);
    node.addEventListener('touchend', touchEnd);
  }

  function checkLongPress(event) {
    if (moved) return;

    selecting = true;
    onDragStart(event);
  }

  function touchMove(event) {
    const offset = getTouchOffset(event);
    if (distanceBetweenOffsets(initialOffset, offset) > moveSens) {
      moved = true;
    }
    if (selecting) onDragMove(event);
  }

  function touchEnd(event) {
    if (timer != null) clearTimeout(timer);
    if (selecting) {
      onDragEnd(event);
    } else if (onNoDragEnd != null) {
      onNoDragEnd(event);
    }
    selecting = false;
    moved = false;
    node.removeEventListener('touchmove', touchMove);
    node.removeEventListener('touchend', touchEnd);
  }

  return {
    destroy() {
      node.removeEventListener('touchstart', touchStart);
    },
  };
}
