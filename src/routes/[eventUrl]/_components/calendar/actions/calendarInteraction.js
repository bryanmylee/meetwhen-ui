import dayjs from 'dayjs';

import { getOffset, getClient, getTarget, getTargets } from 'src/utils/eventHandler';
import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';
import { MS_PER_HOUR } from 'src/utils/constants';

function isQuarterHourTarget(target) {
  return target.dataset.quarterHourTarget != null;
}

function isDefinedSelection(target) {
  return target.dataset.definedSelection != null;
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
      currentAction = onDefinedAction(node);
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
  const touchStart = LongTouchAndDrag({}, handleDown, handleMove, handleUp);
  node.addEventListener('touchstart', touchStart);

  return {
    update({ enabled: newEnabled }) {
      enabled = newEnabled;
    },
    destroy() {
      node.removeEventListener('mousedown', handleDown);
      node.removeEventListener('touchstart', touchStart);
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

// Provide the new start and end ms.
function onDefinedAction(node) {
  let currentAction;

  let initClientX;
  let initClientY;

  let selectionTarget;
  let initStart;
  let initEnd;

  let rowHeight;

  return {
    start(event) {
      const { clientX, clientY } = getClient(event);
      initClientX = clientX;
      initClientY = clientY;

      // Get the defined selection and its details.
      selectionTarget = getTarget(event);
      initStart = dayjs(parseInt(selectionTarget.dataset.startMs, 10));
      initEnd = dayjs(parseInt(selectionTarget.dataset.endMs, 10));

      const durationInHours = (initEnd - initStart) / MS_PER_HOUR;
      const { height } = selectionTarget.getBoundingClientRect();
      rowHeight = Math.round(height / durationInHours);

      const { offsetY } = getOffset(event, selectionTarget);
      if (offsetY < 20) {
        currentAction = resizeDefinedAction(node, { initStart, initEnd, resizeTop: true });
      } else if (height - offsetY < 20) {
        currentAction = resizeDefinedAction(node, { initStart, initEnd, resizeTop: false });
      } else {
        currentAction = moveDefinedAction(node, {
          selectionTarget, initClientX, initClientY, initStart, initEnd, rowHeight,
        });
      }
      if (currentAction != null) {
        currentAction.start(event);
      }
    },
    move(event) {
      if (currentAction != null) {
        currentAction.move(event);
      }
    },
    end(event) {
      if (currentAction != null) {
        currentAction.end(event);
      }
    },
  };
}

function moveDefinedAction(node, {
  selectionTarget, initClientX, initClientY, initStart, initEnd, rowHeight,
}) {
  let dx;
  let dy;

  return {
    start() {
      node.dispatchEvent(new CustomEvent('moveDefinedStart'));
      dx = 0;
      dy = 0;
      selectionTarget.classList.add('moving');
      // selectionTarget.style.pointerEvents = 'none';
    },
    move(event) {
      node.dispatchEvent(new CustomEvent('moveDefinedMove'));
      const { clientX, clientY } = getClient(event);
      dx = clientX - initClientX;
      dy = clientY - initClientY;
      selectionTarget.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    end(event) {
      // Check all layers for underlying caledar targets.
      const targets = getTargets(event);
      const quarterTarget = targets.find(isQuarterHourTarget);
      if (quarterTarget == null) {
        selectionTarget.classList.remove('moving');
        selectionTarget.style.transform = 'translate(0, 0)';
        return;
      }

      const targetDay = dayjs(parseInt(quarterTarget.dataset.dayMs, 10));
      const deltaHour = Math.round(dy / rowHeight * 4) / 4;
      // .hour() only returns whole hours, and we need to account for fractions.
      const initStartHour = initStart.hour() + Math.round(initStart.minute() / 15) / 4;
      let initEndHour = initEnd.hour() + Math.round(initEnd.minute() / 15) / 4;
      // If the end is on a midnight, it must be on the midnight of the following day.
      if (initEndHour === 0) {
        initEndHour = 24;
      }

      node.dispatchEvent(new CustomEvent('moveDefinedStop', {
        detail: {
          initStart,
          newStart: targetDay.add(initStartHour + deltaHour, 'hour'),
          newEnd: targetDay.add(initEndHour + deltaHour, 'hour'),
        },
      }));
      selectionTarget.classList.remove('moving');
      selectionTarget.style.transform = 'translate(0, 0)';
    },
  };
}

// Resize events by deleting the defined selection, and creating a new selection in its place.
function resizeDefinedAction(node, { initStart, initEnd, resizeTop }) {
  const startHour = initStart.hour() + Math.round(initStart.minute() / 15) / 4;
  const startDay = initStart.startOf('day');
  let endHour = initEnd.hour() + Math.round(initEnd.minute() / 15) / 4;
  let endDay = initEnd.startOf('day');
  if (endHour === 0) {
    endHour = 24;
    endDay = endDay.subtract(1, 'day');
  }
  return {
    start() {
      if (resizeTop) {
        node.dispatchEvent(new CustomEvent('resizeDefinedStart', {
          detail: {
            initStart,
            newSelectionStartDay: endDay,
            newSelectionStartHour: endHour - 0.25,
            newSelectionEndDay: startDay,
            newSelectionEndHour: startHour,
          },
        }));
      } else {
        node.dispatchEvent(new CustomEvent('resizeDefinedStart', {
          detail: {
            initStart,
            newSelectionStartDay: startDay,
            newSelectionStartHour: startHour,
            newSelectionEndDay: endDay,
            newSelectionEndHour: endHour - 0.25,
          },
        }));
      }
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
