import { getMouseOffset, getTouchOffset } from 'src/utils/eventHandler';
import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';

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
 * }} actionOptions
 * @param actionOptions.daysToShow An array of days to show in the calendar.
 * @param actionOptions.snapToHour The number of hours to snap selections to.
 */
export default function createSelection(node, {
  daysToShow,
  selectionEnabled = true,
  snapToHour = 0.25,
}) {
  let snap = snapToHour;
  let enabled = selectionEnabled;

  let columnWidth;
  let rowHeight;

  initMeasurements();

  function initMeasurements() {
    columnWidth = node.offsetWidth / daysToShow.length;
    rowHeight = node.offsetHeight / 24;
  }

  let lastClientX;
  let lastClientY;
  let lastOffsetX;
  let lastOffsetY;

  function getDayHour(offsetX, offsetY) {
    const dayIndex = Math.min(
      Math.floor(offsetX / columnWidth),
      daysToShow.length - 1,
    );
    const day = daysToShow[dayIndex];
    const rawHour = offsetY / rowHeight;
    const hour = Math.floor(rawHour / snap) * snap;
    return { day, hour };
  }

  function mouseInteraction() {
    function selectStart(event) {
      if (!enabled) return;
      if (event.buttons !== 1) return;

      initMeasurements();

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
    return {
      update({ selectionEnabled: newSelectionEnabled }) {
        node.style.cursor = newSelectionEnabled ? 'pointer' : 'default';
      },
      destroy() {
        node.removeEventListener('mousedown', selectStart);
      },
    };
  }

  function touchInteraction() {
    const touchStart = new LongTouchAndDrag({ duration: 500 },
      selectStart, selectMove, selectEnd);

    function selectStart(event) {
      if (!enabled) return;

      initMeasurements();

      lastClientX = event.targetTouches[0].clientX;
      lastClientY = event.targetTouches[0].clientY;
      const { offsetX, offsetY } = getTouchOffset(event);
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;

      node.dispatchEvent(new CustomEvent('selectStart', {
        detail: getDayHour(offsetX, offsetY),
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
        detail: getDayHour(offsetX, offsetY),
      }));
    }

    function selectEnd() {
      node.dispatchEvent(new CustomEvent('selectStop'));
    }

    node.addEventListener('touchstart', touchStart);
    return {
      destroy() {
        node.removeEventListener('touchstart', touchStart);
      },
    };
  }

  const mouseUpdateDestroy = mouseInteraction();
  const touchUpdateDestroy = touchInteraction();

  return {
    update({ snapToHour: newSnapToHour = 0.25, selectionEnabled: newSelectionEnabled = true }) {
      snap = newSnapToHour;
      enabled = newSelectionEnabled;
      mouseUpdateDestroy.update({ selectionEnabled: newSelectionEnabled });
    },
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    },
  };
}
