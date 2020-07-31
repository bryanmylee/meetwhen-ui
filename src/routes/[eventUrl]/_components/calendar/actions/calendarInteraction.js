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
        currentAction = moveDefinedAction(node, {
          selectionTarget, initClientX, initClientY, initStart, initEnd, rowHeight,
        });
      } else if (height - offsetY < 20) {
        currentAction = moveDefinedAction(node, {
          selectionTarget, initClientX, initClientY, initStart, initEnd, rowHeight,
        });
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
      selectionTarget.style.pointerEvents = 'none';
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
        selectionTarget.style.pointerEvents = 'unset';
        selectionTarget.style.transform = 'translate(0, 0)';
        return;
      }

      const targetDay = dayjs(parseInt(quarterTarget.dataset.dayMs, 10));
      const deltaHour = Math.round(dy / rowHeight * 4) / 4;
      // .hour() only returns whole hours, and we need to account for fractions.
      const initStartHour = initStart.hour() + initStart.minute() / 60;
      let initEndHour = initEnd.hour() + initEnd.minute() / 60;
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
      selectionTarget.style.pointerEvents = 'unset';
      selectionTarget.style.transform = 'translate(0, 0)';
    },
  };
}
