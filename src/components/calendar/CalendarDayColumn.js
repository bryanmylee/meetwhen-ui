import {
  getMouseOffset,
  getTouchOffset,
  distanceBetweenOffsets,
} from '../../utils/eventHandler.js';
import { getTop } from '../../utils/selection.js';
import { isSelecting } from "../../stores.js";

export function gridColumnMouse(node, { day, snapToHour = 0.25 }) {
  let snap = snapToHour;

  function getSnappedHour(event) {
    const { offsetY } = getMouseOffset(event);
    const ratioY = offsetY / node.offsetHeight;
    const hour = ratioY * 24;
    return Math.floor(hour / snap) * snap;
  }

  function selectStart(event) {
    if (event.buttons === 1) {
      node.dispatchEvent(new CustomEvent('mouseSelectStart', {
        detail: { day, hour: getSnappedHour(event) }
      }));
    }
  }

  function selectMove(event) {
    if (event.buttons === 1) {
      node.dispatchEvent(new CustomEvent('mouseSelectMove', {
        detail: { day, hour: getSnappedHour(event) }
      }));
    }
  }

  function selectStop() {
    node.dispatchEvent(new CustomEvent('mouseSelectStop'));
  }

  node.addEventListener('mousedown', selectStart);
  node.addEventListener('mousemove', selectMove);
  node.addEventListener('mouseup', selectStop);
  return ({
    update({ snapToHour }) {
      snap = snapToHour;
    },
    destroy() {
      node.removeEventListener('mousedown', selectStart);
      node.removeEventListener('mousemove', selectMove);
      node.removeEventListener('mouseup', selectStop);
    }
  });
}

/**
 * To trigger a touch-based selection, wait for a long-press event. 
 * - A long-press event is defined as one where:
 *   - A touchend event is not sent before a specified DELAY.
 *   - The location of the touch does not move beyond a specified RADIUS.
 * - Upon triggering the long-press event, track the location of the touch until
 * - a touchend is sent.
 */
export function gridColumnTouch(node,
    { day, snapToHour = 0.25, longPressDuration = 500 }) {
  let snap = snapToHour;
  let timer = null;
  let initialOffset = null;
  let longPressed = false;
  let moved = false;
  let selecting = false;
  const unsub = isSelecting.subscribe((isSelecting) => {
    selecting = isSelecting;
  });

  function getSnappedHour(event) {
    const { offsetY } = getTouchOffset(event);
    const ratioY = offsetY / node.offsetHeight;
    const hour = ratioY * 24;
    return Math.floor(hour / snap) * snap;
  }

  function touchStart(event) {
    initialOffset = getTouchOffset(event);
    timer = setTimeout(() => longPressStart(event), longPressDuration);
  }

  function longPressStart(event) {
    if (moved) return;

    if (timer != null) clearTimeout(timer);

    longPressed = true;
    isSelecting.set(true);
    node.dispatchEvent(new CustomEvent('mouseSelectStart', {
      detail: { day, hour: getSnappedHour(event) }
    }));
  }

  function touchMove(event) {
    const offset = getTouchOffset(event);
    if (distanceBetweenOffsets(initialOffset, offset) > 15) {
      moved = true;
    }
    if (selecting) {
      node.dispatchEvent(new CustomEvent('mouseSelectMove', {
        detail: { day, hour: getSnappedHour(event) }
      }));
    }
  }

  function touchEnd() {
    if (timer != null) clearTimeout(timer);
    longPressed = false;
    isSelecting.set(false);
    moved = false;
    node.dispatchEvent(new CustomEvent('mouseSelectStop'));
  }

  node.addEventListener('touchstart', touchStart);
  node.addEventListener('touchmove', touchMove);
  node.addEventListener('touchend', touchEnd);
  node.addEventListener('contextmenu', event => event.preventDefault());
}

const MS_PER_HOUR = 3600000;
export function hourSeparator(node, { hour }) {
  node.style.position = 'absolute';
  node.style.top = getTop(hour * MS_PER_HOUR);
}