import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';

/**
 * Get the target of the event, regardless of whether it was a mouse or touch
 * event.
 * @param {MouseEvent | TouchEvent} event The mouse or touch event.
 * @returns {Element} The target of the event.
 */
function getTarget(event) {
  if (event instanceof TouchEvent) {
    return getTouchTarget(event);
  }
  return event.target;
}

function getTouchTarget(event) {
  const { clientX, clientY } = event.changedTouches[0];
  return document.elementFromPoint(clientX, clientY);
}

function isQuarterHourTarget(target) {
  return target.dataset.quarterHourTarget != null;
}

export default function calendarInteraction(node) {
  let currentAction = null;

  function handleDown(event) {
    const target = getTarget(event);
    if (isQuarterHourTarget(target)) {
      currentAction = newSelectAction(node);
    }
    currentAction.start(target);
  }

  function handleMove(event) {
    const target = getTarget(event);
    if (currentAction != null) {
      currentAction.move(target);
    }
  }

  function handleUp() {
    if (currentAction != null) {
      currentAction.end();
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
    start(target) {
      node.dispatchEvent(new CustomEvent('newSelectStart', {
        detail: {
          dayMs: parseInt(target.dataset.dayMs, 10),
          hour: parseFloat(target.dataset.hour),
        },
      }));
    },
    move(target) {
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
