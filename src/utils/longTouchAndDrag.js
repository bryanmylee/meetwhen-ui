import { getTouchOffset, distanceBetweenOffsets } from 'src/utils/eventHandler.js';

export default function longTouchAndDrag(
    { duration = 200, moveSens = 5 }, onDragStart, onDragMove, onDragEnd) {
  let timer = null;
  let initialOffset = null;
  let moved = false;
  let selecting = false;

  const touchStart = (event) => {
    initialOffset = getTouchOffset(event);
    timer = setTimeout(() => checkLongPress(event), duration);

    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', touchEnd);
  }

  const checkLongPress = (event) => {
    if (moved) return;

    selecting = true;
    onDragStart(event);
  }

  const touchMove = (event) => {
    const offset = getTouchOffset(event);
    if (distanceBetweenOffsets(initialOffset, offset) > moveSens) {
      moved = true;
    }
    if (selecting) onDragMove(event);
  }

  const touchEnd = (event) => {
    if (timer != null) clearTimeout(timer);
    selecting = false;
    moved = false;

    onDragEnd(event);

    window.removeEventListener('touchmove', touchMove);
    window.removeEventListener('touchend', touchEnd);
  }

  return touchStart;
}