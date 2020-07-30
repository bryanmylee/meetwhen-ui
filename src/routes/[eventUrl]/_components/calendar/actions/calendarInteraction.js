import dayjs from 'dayjs';

import { getTarget } from 'src/utils/eventHandler';
import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';

function isQuarterHourTarget(target) {
  return target.dataset.quarterHourTarget != null;
}

function isDefinedSelection(target) {
  return target.dataset.definedSelection != null;
}

export default function calendarInteraction(node) {
  let currentAction = null;

  function handleDown(event) {
    const target = getTarget(event);
    if (isQuarterHourTarget(target)) {
      currentAction = newSelectAction(node);
    } else if (isDefinedSelection(target)) {
      currentAction = moveDefinedAction(node);
    }
    currentAction.start(event);
  }

  function handleMove(event) {
    if (currentAction != null) {
      currentAction.move(event);
    }
  }

  function handleUp(event) {
    if (currentAction != null) {
      currentAction.end(event);
      currentAction = null;
    }
  }

  node.addEventListener('mousedown', handleDown);
  node.addEventListener('mousemove', handleMove);
  node.addEventListener('mouseup', handleUp);
  const touchStart = LongTouchAndDrag({}, handleDown, handleMove, handleUp);
  node.addEventListener('touchstart', touchStart);
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
function moveDefinedAction(node) {
  let selectionTarget;

  let initClientX;
  let initClientY;
  let dx;
  let dy;

  let initStart;
  let initEnd;

  let rowHeight;

  return {
    start(event) {
      node.dispatchEvent(new CustomEvent('moveDefinedStart'));
      initClientX = event.clientX;
      initClientY = event.clientY;

      // Get the defined selection and its details.
      selectionTarget = getTarget(event);
      initStart = dayjs(parseInt(selectionTarget.dataset.startMs, 10));
      initEnd = dayjs(parseInt(selectionTarget.dataset.endMs, 10));

      // Determine the height of each row, representing one hour.
      rowHeight = node.offsetHeight / 24;

      selectionTarget.style.pointerEvents = 'none';
    },
    move(event) {
      node.dispatchEvent(new CustomEvent('moveDefinedMove'));
      const { clientX, clientY } = event;
      dx = clientX - initClientX;
      dy = clientY - initClientY;
      selectionTarget.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    end(event) {
      const target = getTarget(event);
      if (!isQuarterHourTarget(target)) {
        selectionTarget.style.pointerEvents = 'unset';
        selectionTarget.style.transform = 'translate(0, 0)';
        return;
      }

      const quarterTargetDay = dayjs(parseInt(target.dataset.dayMs, 10));
      const deltaRow = dy / rowHeight;
      const deltaHour = Math.floor(deltaRow / 0.25 + 0.5) * 0.25;
      const initStartHour = initStart.hour() + initStart.minute() / 60;
      let initEndHour = initEnd.hour() + initEnd.minute() / 60;
      if (initEndHour === 0) {
        initEndHour = 24;
      }

      node.dispatchEvent(new CustomEvent('moveDefinedStop', {
        detail: {
          initStart,
          newStart: quarterTargetDay.add(initStartHour + deltaHour, 'hour'),
          newEnd: quarterTargetDay.add(initEndHour + deltaHour, 'hour'),
        },
      }));
      selectionTarget.style.pointerEvents = 'unset';
      selectionTarget.style.transform = 'translate(0, 0)';
    },
  };
}
