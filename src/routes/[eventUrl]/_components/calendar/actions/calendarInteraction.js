import dayjs from 'dayjs';

import { getOffset, getClient, getTarget, getTargets } from 'src/utils/eventHandler';
import longTouchDrag from 'src/utils/longTouchDrag';
import { dragDropState, dragDropEnum } from '../stores';

function isQuarterHourTarget(target) {
  return target.dataset.quarterHourTarget != null;
}

function isDefinedSelection(target) {
  return target.dataset.definedSelection != null;
}

function isTopResizeHandler(target) {
  return target.dataset.resizeDefinedSelection != null && target.dataset.top != null;
}

function isBottomResizeHandler(target) {
  return target.dataset.resizeDefinedSelection != null && target.dataset.bottom != null;
}

function isTrashTarget(target) {
  return target.dataset.trashTarget != null;
}

export default function calendarInteraction(node, { enabled: initEnabled = false } = {}) {
  let enabled = initEnabled;
  let currentAction = null;

  function handleDown(event) {
    if (!enabled) {
      return;
    }
    const target = getTarget(event);
    if (isQuarterHourTarget(target)) {
      currentAction = newSelectAction(node);
    } else if (isDefinedSelection(target)) {
      currentAction = moveDefinedAction(node);
    } else if (isTopResizeHandler(target)) {
      currentAction = resizeDefinedAction(node, { resizeTop: true });
    } else if (isBottomResizeHandler(target)) {
      currentAction = resizeDefinedAction(node, { resizeTop: false });
    } else {
      return;
    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    currentAction.start(event);
  }

  function handleMove(event) {
    if (!enabled || currentAction == null) {
      return;
    }
    currentAction.move(event);
  }

  function handleUp(event) {
    if (currentAction == null) {
      return;
    }
    currentAction.end(event);
    currentAction = null;
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleUp);
  }

  node.addEventListener('mousedown', handleDown);
  const longTouch = longTouchDrag(node, {
    onDragStart: handleDown,
    onDragMove: handleMove,
    onDragEnd: handleUp,
  });

  return {
    update({ enabled: newEnabled }) {
      enabled = newEnabled;
    },
    destroy() {
      node.removeEventListener('mousedown', handleDown);
      longTouch.destroy();
    },
  };
}

function newSelectAction(node) {
  return {
    start(event) {
      const target = getTarget(event);
      node.dispatchEvent(new CustomEvent('newSelectStart', {
        detail: {
          dayMs: parseInt(target.dataset.dayMs, 10),
          hour: parseFloat(target.dataset.hour),
        },
      }));
    },
    move(event) {
      const target = getTarget(event);
      if (!isQuarterHourTarget(target)) {
        return;
      }
      node.dispatchEvent(new CustomEvent('newSelectMove', {
        detail: {
          dayMs: parseInt(target.dataset.dayMs, 10),
          hour: parseFloat(target.dataset.hour),
        },
      }));
    },
    end() {
      node.dispatchEvent(new CustomEvent('newSelectStop'));
    },
  };
}

function moveDefinedAction(node) {
  let initClientX;
  let initClientY;
  let dx;
  let dy;

  let initQuarter;
  let quarterTargetHeight;
  let initOffsetY;

  let selectionTarget;
  let initStartDayHour;
  let initEndDayHour;

  return {
    start(event) {
      dragDropState.set(dragDropEnum.MOVING);
      const { clientX, clientY } = getClient(event);
      initClientX = clientX;
      initClientY = clientY;
      dx = 0;
      dy = 0;

      // Get the defined selection and its details.
      const targets = getTargets(event);
      const quarterTarget = targets.find(isQuarterHourTarget);
      initQuarter = dayjs(parseInt(quarterTarget.dataset.dayMs, 10)).add(parseFloat(quarterTarget.dataset.hour), 'hour');
      quarterTargetHeight = quarterTarget.getBoundingClientRect().height;
      initOffsetY = getOffset(event, quarterTarget).offsetY;

      selectionTarget = targets.find(isDefinedSelection);
      initStartDayHour = dayjs(parseInt(selectionTarget.dataset.startMs, 10));
      initEndDayHour = dayjs(parseInt(selectionTarget.dataset.endMs, 10));

      selectionTarget.classList.add('moving');
    },
    move(event) {
      const { clientX, clientY } = getClient(event);
      dx = clientX - initClientX;
      dy = clientY - initClientY;

      const targets = getTargets(event);
      const trashTarget = targets.find(isTrashTarget);
      if (trashTarget != null) {
        selectionTarget.classList.add('deleting');
      } else {
        selectionTarget.classList.remove('deleting');
      }

      selectionTarget.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    end(event) {
      dragDropState.set(dragDropEnum.NONE);
      // Check all layers for underlying calendar targets.
      const targets = getTargets(event);
      const trashTarget = targets.find(isTrashTarget);
      if (trashTarget != null) {
        node.dispatchEvent(new CustomEvent('deleteDefined', {
          detail: {
            initStartDayHour,
          },
        }));
        return;
      }

      const { clientX, clientY } = getClient(event);
      // Account for offset on initial quarter target and rounding to half the width of target.
      const quarterTarget = document
        .elementsFromPoint(clientX, clientY - initOffsetY + quarterTargetHeight / 2)
        .find(isQuarterHourTarget);
      if (quarterTarget == null) {
        selectionTarget.classList.remove('moving');
        selectionTarget.style.transform = 'translate(0, 0)';
        return;
      }

      const newQuarter = dayjs(parseInt(quarterTarget.dataset.dayMs, 10)).add(parseFloat(quarterTarget.dataset.hour), 'hour');
      const deltaMs = newQuarter - initQuarter;

      node.dispatchEvent(new CustomEvent('moveDefinedStop', {
        detail: {
          initStartDayHour,
          newStartDayHour: initStartDayHour.add(deltaMs, 'ms'),
          newEndDayHour: initEndDayHour.add(deltaMs, 'ms'),
        },
      }));
      selectionTarget.classList.remove('moving');
      selectionTarget.style.transform = 'translate(0, 0)';
    },
  };
}

// Resize events by deleting the defined selection, and creating a new selection in its place.
function resizeDefinedAction(node, { resizeTop }) {
  let initStartDayHour;
  let selectionTarget;

  return {
    start(event) {
      dragDropState.set(resizeTop ? dragDropEnum.RESIZING_TOP : dragDropEnum.RESIZING_BOTTOM);
      const targets = getTargets(event);
      selectionTarget = targets.find(isDefinedSelection);
      selectionTarget.style.opacity = 0;

      initStartDayHour = dayjs(parseInt(selectionTarget.dataset.startMs, 10));

      if (resizeTop) {
        node.dispatchEvent(new CustomEvent('resizeDefinedStart', {
          detail: {
            downDayHour: dayjs(parseInt(selectionTarget.dataset.endMs, 10)).subtract(15, 'minute'),
            upDayHour: dayjs(parseInt(selectionTarget.dataset.startMs, 10)),
          },
        }));
      } else {
        node.dispatchEvent(new CustomEvent('resizeDefinedStart', {
          detail: {
            downDayHour: dayjs(parseInt(selectionTarget.dataset.startMs, 10)),
            upDayHour: dayjs(parseInt(selectionTarget.dataset.endMs, 10)).subtract(15, 'minute'),
          },
        }));
      }
    },
    move(event) {
      const quarterTarget = getTargets(event).find(isQuarterHourTarget);
      if (quarterTarget == null) {
        return;
      }
      node.dispatchEvent(new CustomEvent('resizeDefinedMove', {
        detail: {
          dayMs: parseInt(quarterTarget.dataset.dayMs, 10),
          hour: parseFloat(quarterTarget.dataset.hour),
        },
      }));
    },
    end() {
      dragDropState.set(dragDropEnum.NONE);
      if (selectionTarget != null) {
        selectionTarget.style.opacity = 1;
      }
      node.dispatchEvent(new CustomEvent('resizeDefinedStop', {
        detail: { initStartDayHour },
      }));
    },
  };
}
