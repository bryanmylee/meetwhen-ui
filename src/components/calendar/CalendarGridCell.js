import { getMouseOffset } from '../../utils/mouseEventHandler.js';

export function gridCellMouse(node, { day, hour, snap }) {
  let toSnap = snap;
  function getRatioY(offsetY) {
    const ratioY = offsetY / node.offsetHeight;
    return Math.floor(ratioY / toSnap) * toSnap;
  }
  function selectStart(event) {
    const { offsetY } = getMouseOffset(event);
    const ratioY = getRatioY(offsetY);
    if (event.buttons === 1) {
      node.dispatchEvent(new CustomEvent('mouseSelectStart', {
        detail: {
          day,
          hour: hour + ratioY,
        }
      }));
    }
  }
  function selectMove(event) {
    const { offsetY } = getMouseOffset(event);
    const ratioY = getRatioY(offsetY);
    if (event.buttons === 1) {
      node.dispatchEvent(new CustomEvent('mouseSelectMove', {
        detail: {
          day,
          hour: hour + ratioY,
        }
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
    update({ snap }) {
      toSnap = snap;
    },
    destroy() {
      node.removeEventListener('mousedown', selectStart);
      node.removeEventListener('mousemove', selectMove);
      node.removeEventListener('mouseup', selectStop);
    }
  });
}