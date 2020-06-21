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
export function createSelection(node, {
  daysToShow,
  selectionEnabled = true,
  snapToHour = 0.25,
  longPressDuration = 500,
}) {
  let snap = snapToHour;
  let enabled = selectionEnabled;

  const columnWidth = node.offsetWidth / daysToShow.length;
  const rowHeight = node.offsetHeight / 24;

  let lastClientX;
  let lastClientY;
  let lastOffsetX;
  let lastOffsetY;

  function getDayHour(offsetX, offsetY) {
    const dayIndex = Math.min(
        Math.floor(offsetX / columnWidth), daysToShow.length - 1);
    const day = daysToShow[dayIndex];
    const rawHour = offsetY / rowHeight;
    const hour = Math.floor(rawHour / snap) * snap;
    return { day, hour };
  }

  function mouseInteraction() {
    function selectStart(event) {
      if (!enabled) return;
      if (event.buttons !== 1) return;

      lastClientX = event.clientX;
      lastClientY = event.clientY;
      const { offsetX, offsetY } = getMouseOffset(event);
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;

      node.dispatchEvent(new CustomEvent('selectStart', {
        detail: getDayHour(offsetX, offsetY),
      }));

      window.addEventListener('mousemove', selectMove);
      window.addEventListener('mouseup', selectStop);
    }

    function selectMove(event) {
      if (event.buttons !== 1) return;

      // Use offset of the creation layer to trigger day hour calculation if
      // mouse is over the layer. Otherwise, use client x and y.
      if (event.target === node) {
        selectMoveOverNode(event);
      } else {
        selectMoveOffNode(event);
      }
    }

    function selectMoveOverNode(event) {
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      const { offsetX, offsetY } = getMouseOffset(event);
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;

      node.dispatchEvent(new CustomEvent('selectMove', {
        detail: getDayHour(offsetX, offsetY),
      }));
    }

    function selectMoveOffNode(event) {
      const dx = event.clientX - lastClientX;
      const dy = event.clientY - lastClientY;
      const offsetX = Math.min(Math.max(lastOffsetX + dx, 0), node.offsetWidth);
      const offsetY = Math.min(Math.max(lastOffsetY + dy, 0), node.offsetHeight);

      node.dispatchEvent(new CustomEvent('selectMove', {
        detail: getDayHour(offsetX, offsetY),
      }));
    }

    function selectStop() {
      node.dispatchEvent(new CustomEvent('selectStop'));

      window.removeEventListener('mousemove', selectMove);
      window.removeEventListener('mouseup', selectStop);
    }

    node.style.cursor = enabled ? 'pointer' : 'default';
    node.addEventListener('mousedown', selectStart);
    return ({
      update({ selectionEnabled }) {
        enabled = selectionEnabled;
        node.style.cursor = enabled ? 'pointer' : 'default';
      },
      destroy() {
        node.removeEventListener('mousedown', selectStart);
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
      if (!selectionEnabled) return;
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
    update({ selectionEnabled }) {
      mouseUpdateDestroy.update({selectionEnabled});
    },
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    }
  });
}

export function dragAndResizable(node, { resizeHandleSize = 7 } = {}) {
  function isResizingTop(offsetY) {
    return offsetY < resizeHandleSize;
  }

  function isResizingBottom(offsetY, height) {
    return height - offsetY < resizeHandleSize;
  }

  function handleMouseMove(event) {
    const { height } = node.getBoundingClientRect();
    const { offsetY } = getMouseOffset(event);
    if (isResizingTop(offsetY) || isResizingBottom(offsetY, height)) {
      node.style.cursor = 'row-resize';
    } else {
      node.style.cursor = 'move';
    }
  }

  function handleMouseDown(event) {
    const { offsetY } = getMouseOffset(event);
    const { height } = node.getBoundingClientRect();
    if (isResizingTop(offsetY)) {
      console.log('start resizing top');
    } else if (isResizingBottom(offsetY, height)) {
      console.log('start resizing bottom');
    } else {
      console.log('start dragging');
    }
  }

  node.addEventListener('mousemove', handleMouseMove);
  node.addEventListener('mousedown', handleMouseDown);
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
export function smoothSizePos(node, { start, end, duration = 100 }) {
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
