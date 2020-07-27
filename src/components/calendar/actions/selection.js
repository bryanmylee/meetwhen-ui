/* eslint-disable no-shadow */
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import {
  getMouseOffset,
  getTouchOffset,
} from 'src/utils/eventHandler';
import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';
import { MS_PER_HOUR } from 'src/utils/constants';

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
export function createSelection(node, {
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
      update({ selectionEnabled }) {
        node.style.cursor = selectionEnabled ? 'pointer' : 'default';
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
    update({ snapToHour = 0.25, selectionEnabled = true }) {
      snap = snapToHour;
      enabled = selectionEnabled;
      mouseUpdateDestroy.update({ selectionEnabled });
    },
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    },
  };
}

/**
 *
 * @param {HTMLElement} node The defined selection element node.
 * @param {{
 *   start: Dayjs,
 *   end: Dayjs,
 *   snapToHour: number,
 *   resizeHandleSize: number
 * }} actionOptions
 * @param actionOptions.start The start of the selection.
 * @param actionOptions.end The end of the selection.
 * @param actionOptions.snapToHour The number of hours to snap move and resize
 * to when dragging.
 * @param actionOptions.resizeHandleSize The number of pixels from the edge of
 * the selection element to treat as a resize handle. Clicks beginning within
 * this boundary will be treated as resize events. Otherwise, they are treated
 * as move events.
 */
export function moveAndResizable(node, {
  start,
  end,
  snapToHour = 0.25,
  resizeHandleSize = 10,
}) {
  let snap = snapToHour;

  let columnWidth;
  let rowHeight;
  let height;
  let startLeft;
  let startTop;

  initMeasurements();

  function initMeasurements() {
    columnWidth = node.offsetWidth;
    rowHeight = node.offsetHeight / ((end - start) / MS_PER_HOUR);
    height = node.getBoundingClientRect().height;
    startLeft = parseFloat(getComputedStyle(node).left);
    startTop = parseFloat(getComputedStyle(node).top);
  }

  let state = null;
  const states = {
    NONE: 'NONE',
    MOVING: 'MOVING',
    RESIZING_TOP: 'RESIZING_TOP',
    RESIZING_BOTTOM: 'RESIZING_BOTTOM',
  };
  // Track the initial state required to calculate drag distance.
  let startClientX;
  let startClientY;
  let dx;
  let dy;

  function startDrag({ offsetY, clientX, clientY }) {
    initMeasurements();
    startClientX = clientX;
    startClientY = clientY;
    dx = 0;
    dy = 0;

    if (shouldResizeTop(offsetY)) {
      state = states.RESIZING_TOP;
      currentAction = resizeSelectionTop;
    } else if (shouldResizeBottom(offsetY)) {
      state = states.RESIZING_BOTTOM;
      currentAction = resizeSelectionBottom;
    } else {
      state = states.MOVING;
      currentAction = moveSelection;
    }

    node.dispatchEvent(new CustomEvent('updateState', {
      detail: { state },
    }));
  }

  function endDrag() {
    state = states.NONE;
    node.dispatchEvent(new CustomEvent('updateState', {
      detail: { state },
    }));
  }

  function shouldResizeTop(offsetY) {
    return offsetY < resizeHandleSize;
  }

  function shouldResizeBottom(offsetY) {
    return height - offsetY < resizeHandleSize;
  }

  // `moveSelection`, `resizeSelectionTop`, and `resizeSelectionBottom` objects
  // contain handlers for moving/ending a mouse or touch drag. move/end are
  // called whenever the `mousemove/touchmove` and `mouseup/touchend` events are
  // dispatched.
  const moveSelection = {
    move({ clientX, clientY }) {
      dx = clientX - startClientX;
      dy = clientY - startClientY;
      node.style.left = `${startLeft + dx}px`;
      node.style.top = `${startTop + dy}px`;
      // Allow pointer events to pass through to trigger trashing the selection.
      node.style.pointerEvents = 'none';
    },
    end(event) {
      node.style.left = `${startLeft}px`;
      node.style.pointerEvents = 'unset';
      const droppedOnTrash = [...event.target.classList].includes('calendar--trash-target');
      if (droppedOnTrash) {
        node.dispatchEvent(new CustomEvent('deleteSelection', {
          detail: {
            originalStart: start, // used to identify which selected was deleted.
          },
        }));
      } else {
        // Update calendar data by dispatching an event, which will call a
        // context function on CalendarPickerBase.
        node.dispatchEvent(new CustomEvent('moveSelection', {
          detail: {
            originalStart: start, // used to identify which selection was dragged.
            originalEnd: end,
            ...getDeltaRowCol(),
          },
        }));
      }
    },
  };

  const resizeSelectionTop = {
    move({ clientX, clientY }) {
      dx = clientX - startClientX;
      dy = clientY - startClientY;
      if (height - dy < rowHeight * 0.25) {
        dy = height - rowHeight * 0.25;
      }
      node.style.top = `${startTop + dy}px`;
      node.style.height = `${height - dy}px`;
    },
    end() {
      const { deltaRow } = getDeltaRowCol();
      node.dispatchEvent(new CustomEvent('resizeSelectionTop', {
        detail: {
          originalStart: start, // used to identify which selection was dragged.
          originalEnd: end,
          newStart: start.add(deltaRow, 'hour'),
        },
      }));
    },
  };

  const resizeSelectionBottom = {
    move({ clientX, clientY }) {
      dx = clientX - startClientX;
      dy = clientY - startClientY;
      if (height + dy < rowHeight * 0.25) {
        dy = -height + rowHeight * 0.25;
      }
      node.style.height = `${height + dy}px`;
    },
    end() {
      const { deltaRow } = getDeltaRowCol();
      node.dispatchEvent(new CustomEvent('resizeSelectionBottom', {
        detail: {
          originalStart: start, // used to identify which selection was dragged.
          originalEnd: end,
          newEnd: end.add(deltaRow, 'hour'),
        },
      }));
    },
  };

  let currentAction = moveSelection;

  function getDeltaRowCol() {
    const rawDeltaRow = dy / rowHeight;
    const deltaRow = Math.floor(rawDeltaRow / snap + 0.5) * snap;
    const deltaCol = Math.floor(dx / columnWidth + 0.5);
    return { deltaRow, deltaCol };
  }

  function mouseInteraction() {
    function setMouseCursor(event) {
      const { offsetY } = getMouseOffset(event);
      if (shouldResizeTop(offsetY) || shouldResizeBottom(offsetY)) {
        node.style.cursor = 'ns-resize';
      } else {
        node.style.cursor = 'move';
      }
    }

    function handleMouseDown(event) {
      const { offsetY } = getMouseOffset(event);
      const { clientX, clientY, target } = event;
      startDrag({ offsetY, clientX, clientY, target });
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event) {
      const { clientX, clientY } = event;
      currentAction.move({ clientX, clientY });
    }

    function handleMouseUp(event) {
      currentAction.end(event);
      endDrag();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    node.addEventListener('mousemove', setMouseCursor);
    node.addEventListener('mousedown', handleMouseDown);
    return {
      destroy() {
        node.removeEventListener('mousemove', setMouseCursor);
        node.removeEventListener('mousedown', handleMouseDown);
      },
    };
  }

  function touchInteraction() {
    const touchStart = new LongTouchAndDrag({ duration: 500 },
      handleDragStart, handleDragMove, handleDragEnd);

    function handleDragStart(event) {
      const { offsetY } = getTouchOffset(event);
      const { clientX, clientY, target } = event.targetTouches[0];
      startDrag({ offsetY, clientX, clientY, target });
    }

    function handleDragMove(event) {
      const { clientX, clientY } = event.targetTouches[0];
      currentAction.move({ clientX, clientY });
    }

    function handleDragEnd() {
      currentAction.end();
      endDrag();
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
    update({ snapToHour = 0.25 }) {
      snap = snapToHour;
    },
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    },
  };
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
    duration,
    easing: cubicOut,
  });
  const unsub = smooth.subscribe(({ startInMs, endInMs }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(startInMs);
    node.style.height = getHeight(endInMs - startInMs);
  });
  return {
    update({ start, end }) {
      const startOfDay = start.startOf('day');
      smooth.set({
        startInMs: start - startOfDay,
        endInMs: end - startOfDay,
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
  return {
    update({ start, end }) {
      node.style.top = getTop(start - start.startOf('day'));
      node.style.height = getHeight(end - start);
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
