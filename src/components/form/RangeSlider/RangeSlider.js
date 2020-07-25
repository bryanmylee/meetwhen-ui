export function createLinkedWidthActions() {
  let referenceNode;
  let targetNode;
  let thumbRadius;
  let value;
  let min;
  let max;

  function updateWidth() {
    if (referenceNode == null || targetNode == null) return;
    const percentage = value / Math.max(max - min, 1);
    const barWidth = parseFloat(getComputedStyle(referenceNode).width) - thumbRadius * 2;
    const newProgressWidth = `${barWidth * percentage}px`;
    targetNode.style.width = newProgressWidth;
  }

  function listenWidth(node) {
    referenceNode = node;
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return {
      destroy() {
        referenceNode = null;
        window.removeEventListener('resize', updateWidth);
      },
    };
  }

  function setWidth(node, {
    thumbRadius: initRadius, value: initValue, min: initMin, max: initMax,
  }) {
    targetNode = node;
    thumbRadius = initRadius;
    value = initValue;
    min = initMin;
    max = initMax;
    updateWidth();
    return {
      update({
        thumbRadius: newRadius, value: newValue, min: newMin, max: newMax,
      }) {
        thumbRadius = newRadius;
        value = newValue;
        min = newMin;
        max = newMax;
        updateWidth();
      },
      destroy() {
        targetNode = null;
      },
    };
  }

  return [listenWidth, setWidth];
}
