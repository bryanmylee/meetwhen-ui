import { getMouseOffset } from '../../utils/mouseEventHandler.js';
import { getTop } from '../../utils/selection.js';

export function gridColumnMouse(node, { day, snapToHour = 0.25 }) {
  let snap = snapToHour;
  function getSnappedHour(event) {
    const { offsetY } = getMouseOffset(event);
    const ratioY = offsetY / node.offsetHeight;
    const hour = ratioY * 24;
    return Math.floor(hour / snap) * snap;
  }
  function selectStart(event) {
    if (event.buttons === 1) {
      node.dispatchEvent(new CustomEvent('mouseSelectStart', {
        detail: { day, hour: getSnappedHour(event) }
      }));
    }
  }
  function selectMove(event) {
    if (event.buttons === 1) {
      node.dispatchEvent(new CustomEvent('mouseSelectMove', {
        detail: { day, hour: getSnappedHour(event) }
      }));
    }
  }
  function selectStop() {
    node.dispatchEvent(new CustomEvent('mouseSelectStop'));
  }
  node.addEventListener('mousedown', selectStart);
  node.addEventListener('mousemove', selectMove);
  node.addEventListener('mouseup', selectStop);
  return ({
    update({ snapToHour }) {
      snap = snapToHour;
    },
    destroy() {
      node.removeEventListener('mousedown', selectStart);
      node.removeEventListener('mousemove', selectMove);
      node.removeEventListener('mouseup', selectStop);
    }
  });
}

const MS_PER_HOUR = 3600000;
export function hourSeparator(node, { hour }) {
  node.style.position = 'absolute';
  node.style.top = getTop(hour * MS_PER_HOUR);
}