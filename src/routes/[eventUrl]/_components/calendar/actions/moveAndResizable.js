import { MS_PER_HOUR } from 'src/utils/constants';
import { getMouseOffset, getTouchOffset } from 'src/utils/eventHandler';
import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';
import { dragDropStates } from '../stores';
import { get_current_component } from 'svelte/internal';

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
export default function moveAndResizable(node, {
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
      state = dragDropStates.RESIZING_TOP;
      currentAction = resizeSelectionTop;
    } else if (shouldResizeBottom(offsetY)) {
      state = dragDropStates.RESIZING_BOTTOM;
      currentAction = resizeSelectionBottom;
    } else {
      state = dragDropStates.MOVING;
      currentAction = moveSelection;
    }

    node.dispatchEvent(new CustomEvent('updateState', {
      detail: { state },
    }));
  }

  function endDrag() {
    state = dragDropStates.NONE;
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
    end({ clientX, clientY }) {
      const targetElements = document.elementsFromPoint(clientX, clientY);
      const droppedOnTrash = targetElements.some((element) => [...element.classList].includes('calendar--trash-target'));
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
      node.style.left = `${startLeft}px`;
      node.style.pointerEvents = 'unset';
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
      const { clientX, clientY } = event;
      currentAction.end({ clientX, clientY });
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

    function handleDragEnd(event) {
      const { clientX, clientY } = event.changedTouches[0];
      currentAction.end({ clientX, clientY });
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
    update({ snapToHour: newSnapToHour = 0.25 }) {
      snap = newSnapToHour;
    },
    destroy() {
      mouseUpdateDestroy.destroy();
      touchUpdateDestroy.destroy();
    },
  };
}
