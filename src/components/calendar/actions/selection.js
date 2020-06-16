import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import {
  getMouseOffset,
  getTouchOffset,
  distanceBetweenOffsets,
} from 'src/utils/eventHandler.js';

/**
 * Provides all custom events for creating new selections with the calendar.
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
export function interactionLayer(node, {
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

const MS_PER_HOUR = 3600000;

/**
 * Get the top required given some starting hour.
 * @param {number} startHourInMs Starting hour in ms.
 * @returns {string} The CSS top for the element.
 */
export function getTop(startHourInMs) {
  const numHoursFromMidnight = startHourInMs / MS_PER_HOUR;
  return `calc(var(--row-height) * ${numHoursFromMidnight})`;
}

/**
 * Get the height required given some duration.
 * @param {number} durationInMs Duration in ms.
 * @returns {string} The CSS height for the element.
 */
export function getHeight(durationInMs) {
  const durationInHours = durationInMs / MS_PER_HOUR;
  return `calc(var(--row-height) * ${durationInHours})`;
}

/**
 * Dynamically and smoothly size an element based on a start and end value.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   start: Dayjs,
 *   end: Dayjs,
 *   duration: number,
 * }} actionOptions
 * @param actionOptions.start The start of the interval.
 * @param actionOptions.end The end of the interval.
 * @param actionOptions.duration The duration of the tweened value.
 */
export function smoothSizePos(node, { start, end, duration = 100}) {
  const startOfDay = start.startOf('day');
  const smooth = tweened({
    startInMs: start - startOfDay,
    endInMs: end - startOfDay,
  }, {
    duration: duration,
    easing: cubicOut,
  });
  const unsub = smooth.subscribe(({ startInMs, endInMs }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(startInMs);
    node.style.height = getHeight(endInMs - startInMs);
  });
  return ({
    update({ start, end }) {
      const startOfDay = start.startOf('day');
      smooth.set({
        startInMs: start - startOfDay,
        endInMs: end - startOfDay,
      });
    },
    destroy() {
      unsub();
    }
  })
}

/**
 * Dynamically size an element based on a start and end value.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   start: Dayjs,
 *   end: Dayjs,
 * }} actionOptions
 * @param actionOptions.start The start of the interval.
 * @param actionOptions.end The end of the interval.
 */
export function sizePos(node, { start, end }) {
  node.style.position = 'absolute';
  node.style.top = getTop(start - start.startOf('day'));
  node.style.height = getHeight(end - start);
  return ({
    update({ start, end }) {
      node.style.top = getTop(start - start.startOf('day'));
      node.style.height = getHeight(end - start);
    }
  });
}

/**
 * Positions the top of an element given a numerical hour.
 * @param {HTMLElement} node The action node.
 * @param {{ hour: number }} actionOptions
 * @param actionOptions.hour The numerical hour to position the element with.
 */
export function top(node, { hour }) {
  node.style.position = 'absolute';
  node.style.top = getTop(hour * MS_PER_HOUR);
}