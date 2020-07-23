import { getTouchOffset, distanceBetweenOffsets } from 'src/utils/eventHandler';

/**
 *
 * @param {{
 *   duration: number,
 *   moveSens: number,
 * }} options
 * @param options.duration The number of milliseconds after the touch event
 * starts before the drag event is triggered.
 * @param options.moveSens The number of pixels the touch event is allowed to
 * move without cancelling the drag event. This allows the long touch drag to be
 * used on scrollable elements, as the drag event will not be triggered if the
 * touch moves too far, defaulting to a scroll event instead.
 * @param {Function} onDragStart The callback for when the touch drag event
 * starts.
 * @param {Function} onDragMove The callback for when the touch event is moved
 * while dragging.
 * @param {Function} onDragEnd The callback for when the touch drag event ends.
 */
export default function LongTouchAndDrag(
  { duration = 200, moveSens = 5 }, onDragStart, onDragMove, onDragEnd,
) {
  let timer = null;
  let initialOffset = null;
  let moved = false;
  let selecting = false;

  function touchStart(event) {
    initialOffset = getTouchOffset(event);
    timer = setTimeout(() => checkLongPress(event), duration);

    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', touchEnd);
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
    selecting = false;
    moved = false;

    onDragEnd(event);

    window.removeEventListener('touchmove', touchMove);
    window.removeEventListener('touchend', touchEnd);
  }

  return touchStart;
}
