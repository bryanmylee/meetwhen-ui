import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { MS_PER_HOUR } from 'src/utils/constants';

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
export function smoothSizePos(node, { columnStart, start, end, duration = 100 }) {
  const smooth = tweened({
    startInMs: start - columnStart,
    endInMs: end - columnStart,
  }, {
    duration,
    easing: cubicOut,
  });
  const unsub = smooth.subscribe(({ startInMs, endInMs }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(startInMs);
    node.style.height = getHeight(endInMs - startInMs);
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
 *   earliestHour: number,
 *   start: Dayjs,
 *   end: Dayjs,
 * }} actionOptions
 * @param actionOptions.start The start of the interval.
 * @param actionOptions.end The end of the interval.
 */
export function sizePos(node, { columnStart, start, end }) {
  node.style.position = 'absolute';
  node.style.top = getTop(start - columnStart);
  node.style.height = getHeight(end - start);
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
