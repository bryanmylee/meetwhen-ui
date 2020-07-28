import { getMouseOffset, getTouchOffset } from 'src/utils/eventHandler';
import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';

const snap = 0.25;
function getHour(offsetY, rowHeight) {
  const hour = offsetY / rowHeight;
  return Math.floor(hour / snap) * snap;
}

export default function createNewSelection(node, { day, enabled: initEnabled = true }) {
  const mouseAction = mouseCreateNewSelection(node, { day, enabled: initEnabled });

  return {
    update({ enabled: newEnabled }) {
      mouseAction.update({ enabled: newEnabled });
    },
    destroy() {
      mouseAction.destroy();
    },
  };
}

function mouseCreateNewSelection(node, { day, enabled: initEnabled }) {
  let enabled = initEnabled;

  const rowHeight = node.offsetHeight / 24;

  function start(event) {
    if (!enabled || event.buttons !== 1) return;
    const { offsetY } = getMouseOffset(event);
    node.dispatchEvent(new CustomEvent('newSelectStart', {
      detail: { day, hour: getHour(offsetY, rowHeight) },
    }));
  }

  function move(event) {
    if (!enabled || event.buttons !== 1) return;
    const { offsetY } = getMouseOffset(event);
    node.dispatchEvent(new CustomEvent('newSelectMove', {
      detail: { day, hour: getHour(offsetY, rowHeight) },
    }));
  }

  function end() {
    node.dispatchEvent(new CustomEvent('newSelectEnd'));
  }

  node.style.cursor = enabled ? 'pointer' : 'default';
  node.addEventListener('mousedown', start);
  node.addEventListener('mousemove', move);
  node.addEventListener('mouseup', end);

  return {
    update({ enabled: newEnabled }) {
      enabled = newEnabled;
      node.style.cursor = enabled ? 'pointer' : 'default';
    },
    destroy() {
      node.removeEventListener('mousedown', start);
      node.removeEventListener('mousemove', move);
      node.removeEventListener('mouseup', end);
    },
  };
}
