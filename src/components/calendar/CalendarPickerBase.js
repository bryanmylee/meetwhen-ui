import {
  getMouseOffset,
  getTouchOffset,
  distanceBetweenOffsets,
} from '../../utils/eventHandler.js';

/**
 * Provides all custom events for interacting with the calendar.
 *
 * The node using this action will dispatch three custom events:
 * - `selectStart` A selection was started with `{detail: { day, hour }}`.
 * - `selectMove` A selection was moved with `{detail: { day, hour }}`.
 * - `selectStop` A selection was stopped.
 * @param {HTMLElement} node The calendar interaction layer node.
 * @param {{
 *   daysToShow: Dayjs[],
 *   snapToHour: number,
 *   longPressDuration: number,
 * }} actionOptions
 * @param actionOptions.daysToShow An array of days to show in the calendar.
 * @param actionOptions.snapToHour The number of hours to snap selections to.
 * @param actionOptions.longPressDuration The time to wait before triggering a
 * long press in ms.
 */
export function interaction(node, {
  daysToShow,
  snapToHour = 0.25,
  longPressDuration = 500,
}) {
  let snap = snapToHour;

  function getDayHour({ offsetX, offsetY }) {
    const ratioX = offsetX / node.offsetWidth;
    const ratioY = offsetY / node.offsetHeight;
    const dayIndex = Math.min(
        Math.floor(ratioX * daysToShow.length), daysToShow.length - 1);
    const day = daysToShow[dayIndex];
    const rawHour = ratioY * 24;
    const hour = Math.floor(rawHour / snap) * snap;
    return { day, hour };
  }

  function mouseInteraction() {
    function selectStart(event) {
      if (event.buttons === 1) {
        node.dispatchEvent(new CustomEvent('selectStart', {
          detail: getDayHour(getMouseOffset(event)),
        }));
      }
    }

    function selectMove(event) {
      if (event.buttons === 1) {
        node.dispatchEvent(new CustomEvent('selectMove', {
          detail: getDayHour(getMouseOffset(event)),
        }));
      }
    }

    function selectStop() {
      node.dispatchEvent(new CustomEvent('selectStop'));
    }

    node.addEventListener('mousedown', selectStart);
    node.addEventListener('mousemove', selectMove);
    node.addEventListener('mouseup', selectStop);
    return ({
      destroy() {
        node.removeEventListener('mousedown', selectStart);
        node.removeEventListener('mousemove', selectMove);
        node.removeEventListener('mouseup', selectStop);
      }
    });
  }

  function touchInteraction() {
    let timer = null;
    let initialOffset = null;
    let longPressed = false;
    let moved = false;
    let selecting = false;

    function touchStart(event) {
      initialOffset = getTouchOffset(event);
      timer = setTimeout(() => longPressStart(event), longPressDuration);
    }

    function longPressStart(event) {
      if (timer != null) clearTimeout(timer);
      if (moved) return;

      longPressed = true;
      selecting = true;
      node.dispatchEvent(new CustomEvent('selectStart', {
        detail: getDayHour(getTouchOffset(event)),
      }));
    }

    function touchMove(event) {
      const offset = getTouchOffset(event);
      if (distanceBetweenOffsets(initialOffset, offset) > 15) {
        moved = true;
      }
      if (selecting) {
        node.dispatchEvent(new CustomEvent('selectMove', {
          detail: getDayHour(getTouchOffset(event)),
        }));
      }
    }

    function touchEnd() {
      if (timer != null) clearTimeout(timer);
      longPressed = false;
      selecting = false;
      moved = false;
      node.dispatchEvent(new CustomEvent('selectStop'));
    }

    node.addEventListener('touchstart', touchStart);
    node.addEventListener('touchmove', touchMove);
    node.addEventListener('touchend', touchEnd);
    node.addEventListener('contextmenu', event => event.preventDefault());
    return ({
      destroy() {
        node.removeEventListener('touchstart', touchStart);
        node.removeEventListener('touchmove', touchMove);
        node.removeEventListener('touchend', touchEnd);
        node.removeEventListener('touchmove', event => event.preventDefault());
      }
    });
  }

  const mouseUpdateDestroy = mouseInteraction();
  const touchUpdateDestroy = touchInteraction();

  return ({
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    }
  });
}
