import {
  getMouseOffset,
  getTouchOffset,
} from 'src/utils/eventHandler.js';
import longTouchAndDrag from 'src/utils/longTouchAndDrag.js';

/**
 * Provides all custom events for creating new selections with the date picker.
 *
 * The node using this action will dispatch three custom events:
 * - `selectStart` A selection was started with `{detail: { date }}`.
 * - `selectMove` A selection was moved with `{detail: { date }}`.
 * - `selectStop` A selection was stopped.
 * @param {HTMLElement} node The calendar interaction layer node.
 * @param {{
 *   selectedMonth: Dayjs,
 * }} actionOptions
 * @param actionOptions.selectedMonth The selected month of the date picker.
 */
export function createSelection(node, { selectedMonth }) {
  const DAYS_IN_WEEK = 7;
  // All responds to changes in selectedMonth
  let numDays = selectedMonth.daysInMonth();
  let firstDate = selectedMonth.date(1);
  let firstDayOfWeek = firstDate.day();
  let numWeeks = Math.ceil((numDays + firstDayOfWeek) / DAYS_IN_WEEK);
  let columnWidth = node.offsetWidth / DAYS_IN_WEEK;
  let rowHeight = node.offsetHeight / numWeeks;

  let lastClientX, lastClientY, lastOffsetX, lastOffsetY;

  function getDate(offsetX, offsetY) {
    const dayIndex = Math.min(Math.floor(offsetX / columnWidth), 6);
    const weekIndex = Math.min(Math.floor(offsetY / rowHeight), numWeeks);
    const date = firstDate
        .subtract(firstDayOfWeek, 'day')
        .add(dayIndex, 'day').add(weekIndex, 'week');
    return date;
  }

  function mouseInteraction() {
    function selectStart(event) {
      if (event.buttons !== 1) return;

      lastClientX = event.clientX;
      lastClientY = event.clientY;
      const { offsetX, offsetY } = getMouseOffset(event);
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;

      node.dispatchEvent(new CustomEvent('selectStart', {
        detail: { date: getDate(offsetX, offsetY) },
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
        detail: { date: getDate(offsetX, offsetY) },
      }));
    }

    function selectMoveOffNode(event) {
      const dx = event.clientX - lastClientX;
      const dy = event.clientY - lastClientY;
      const offsetX = Math.min(Math.max(lastOffsetX + dx, 0), node.offsetWidth);
      const offsetY = Math.min(Math.max(lastOffsetY + dy, 0), node.offsetHeight);

      node.dispatchEvent(new CustomEvent('selectMove', {
        detail: { date: getDate(offsetX, offsetY) },
      }));
    }

    function selectStop() {
      node.dispatchEvent(new CustomEvent('selectStop'));

      window.removeEventListener('mousemove', selectMove);
      window.removeEventListener('mouseup', selectStop);
    }

    node.style.cursor = 'pointer';
    node.addEventListener('mousedown', selectStart);
    return ({
      destroy() {
        node.removeEventListener('mousedown', selectStart);
      }
    });
  }

  function touchInteraction() {
    const touchStart = new longTouchAndDrag({ duration: 500 },
        selectStart, selectMove, selectEnd);

    function selectStart(event) {
      lastClientX = event.targetTouches[0].clientX;
      lastClientY = event.targetTouches[0].clientY;
      const { offsetX, offsetY } = getTouchOffset(event);
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;

      node.dispatchEvent(new CustomEvent('selectStart', {
        detail: { date: getDate(offsetX, offsetY) },
      }));
    }

    function selectMove(event) {
      // The target of a touch event will always be the node it was triggered
      // from. Therefore, we do not need to check for target.
      // In addition, the calendar cannot be scrolled while selecting.
      // Therefore, we can rely on change in touch position to calculate
      // day and hours.
      const dx = event.targetTouches[0].clientX - lastClientX;
      const dy = event.targetTouches[0].clientY - lastClientY;
      const offsetX = Math.min(Math.max(lastOffsetX + dx, 0), node.offsetWidth);
      const offsetY = Math.min(Math.max(lastOffsetY + dy, 0), node.offsetHeight);

      node.dispatchEvent(new CustomEvent('selectMove', {
        detail: { date: getDate(offsetX, offsetY) },
      }));
    }

    function selectEnd() {
      node.dispatchEvent(new CustomEvent('selectStop'));
    }

    node.addEventListener('touchstart', touchStart);
    return ({
      destroy() {
        node.removeEventListener('touchstart', touchStart);
      }
    });
  }

  const mouseUpdateDestroy = mouseInteraction();
  const touchUpdateDestroy = touchInteraction();

  return ({
    update({ selectedMonth }) {
      // All responds to changes in selectedMonth
      numDays = selectedMonth.daysInMonth();
      firstDate = selectedMonth.date(1);
      firstDayOfWeek = firstDate.day();
      numWeeks = Math.ceil((numDays + firstDayOfWeek) / DAYS_IN_WEEK);
      columnWidth = node.offsetWidth / DAYS_IN_WEEK;
      rowHeight = node.offsetHeight / numWeeks;
    },
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    }
  });
}