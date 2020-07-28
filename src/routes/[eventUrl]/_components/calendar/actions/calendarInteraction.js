import LongTouchAndDrag from 'src/utils/LongTouchAndDrag';

function getTouchTarget(event) {
  const { clientX, clientY } = event.changedTouches[0];
  return document.elementFromPoint(clientX, clientY);
}

function isQuarterHourTarget(node) {
  return node.dataset.quarterHourTarget != null;
}

export default function calendarInteraction(node) {
  function handleMouseDown(event) {
    console.log('mousedown', isQuarterHourTarget(event.target));
  }

  function handleLongTouchStart(event) {
    console.log('touchstart', isQuarterHourTarget(getTouchTarget(event)));
  }

  function handleLongTouchMove(event) {
    console.log('touchmove', isQuarterHourTarget(getTouchTarget(event)));
  }

  function handleLongTouchEnd(event) {
    console.log('touchend', isQuarterHourTarget(getTouchTarget(event)));
  }

  node.addEventListener('mousedown', handleMouseDown);
  const touchStart = LongTouchAndDrag({},
    handleLongTouchStart, handleLongTouchMove, handleLongTouchEnd);
  node.addEventListener('touchstart', touchStart);
}
