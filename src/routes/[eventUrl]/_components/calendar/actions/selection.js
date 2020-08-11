import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { MS_PER_HOUR } from 'src/utils/constants';

/**
 * Dynamically and smoothly size an element based on a start and end value.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   columnStart: Dayjs,
 *   columnEnd: Dayjs,
 *   start: Dayjs,
 *   end: Dayjs,
 *   duration: number,
 * }} actionOptions
 * @param actionOptions.columnStart The start of the column.
 * @param actionOptions.columnEnd The end of the column.
 * @param actionOptions.start The start of the interval.
 * @param actionOptions.end The end of the interval.
 * @param actionOptions.duration The duration of the tweened value.
 */
export function smoothSizePos(node, { columnStart, columnEnd, start, end, duration = 100 }) {
  const smooth = tweened({
    startInMs: start - columnStart,
    endInMs: end - columnStart,
  }, {
    duration,
    easing: cubicOut,
  });
  const numHours = (columnEnd - columnStart) / MS_PER_HOUR;
  const unsub = smooth.subscribe(({ startInMs, endInMs }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(startInMs, numHours);
    node.style.height = getHeight(endInMs - startInMs, numHours);
  });
  return {
    update({ start: newStart, end: newEnd }) {
      smooth.set({
        startInMs: newStart - columnStart,
        endInMs: newEnd - columnStart,
      });
    },
    destroy() {
      unsub();
    },
  };
}

/**
 * Dynamically size an element based on a start and end value.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   columnStart: Dayjs,
 *   columnEnd: Dayjs,
 *   start: Dayjs,
 *   end: Dayjs,
 * }} actionOptions
 * @param actionOptions.columnStart The start of the column.
 * @param actionOptions.columnEnd The end of the column.
 * @param actionOptions.start The start of the interval.
 * @param actionOptions.end The end of the interval.
 */
export function sizePos(node, { columnStart, columnEnd, start, end }) {
  const numHours = (columnEnd - columnStart) / MS_PER_HOUR;
  node.style.position = 'absolute';
  node.style.top = getTop(start - columnStart, numHours);
  node.style.height = getHeight(end - start, numHours);
  return {
    update({ start: newStart, end: newEnd }) {
      node.style.top = getTop(newStart - columnStart);
      node.style.height = getHeight(newEnd - newStart);
    },
  };
}

/**
 * Get the top required given some starting hour.
 * @param {number} startHourInMs Starting hour in ms.
 * @param {number} numHours The number of hours in the column.
 * @returns {string} The CSS top for the element.
 */
export function getTop(startHourInMs, numHours) {
  const numHoursFromMidnight = startHourInMs / MS_PER_HOUR;
  return `${numHoursFromMidnight / numHours * 100}%`;
}

/**
 * Get the height required given some duration.
 * @param {number} durationInMs Duration in ms.
 * @param {number} numHours The number of hours in the column.
 * @returns {string} The CSS height for the element.
 */
export function getHeight(durationInMs, numHours) {
  const durationInHours = durationInMs / MS_PER_HOUR;
  return `${durationInHours / numHours * 100}%`;
}
