import dayjs from 'dayjs';

import { getTarget } from 'src/utils/eventHandler';
import longTouchDrag from 'src/utils/longTouchDrag';

function isDateTarget(target) {
  return target.dataset.dateTarget != null;
}

export default function datePickerInteraction(node) {
  function handleDown(event) {
    const target = getTarget(event);
    if (!isDateTarget(target)) {
      return;
    }
    const { selected, dateMs, isPast } = target.dataset;
    if (isPast === 'true') {
      return;
    }
    node.dispatchEvent(new CustomEvent('dateSelectStart', {
      detail: {
        selected: selected === 'true',
        date: dayjs(+dateMs),
      },
    }));
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }

  function handleMove(event) {
    const target = getTarget(event);
    if (!isDateTarget(target)) {
      return;
    }
    const { dateMs, isPast } = target.dataset;
    if (isPast === 'true') {
      return;
    }
    node.dispatchEvent(new CustomEvent('dateSelectMove', {
      detail: {
        date: dayjs(+dateMs),
      },
    }));
  }

  function handleUp() {
    node.dispatchEvent(new CustomEvent('dateSelectStop'));
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
    destroy() {
      node.removeEventListener('mousedown', handleDown);
      longTouch.destroy();
    },
  };
}
