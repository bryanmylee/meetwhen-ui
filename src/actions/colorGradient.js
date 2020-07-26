/* eslint-disable no-shadow */
/**
 * Programmatically sets the background color of an element based on a color
 * scale, with highlighting on mouseover.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   scale: chroma.Scale,
 *   index: number,
 *   total: number,
 *   highlighted: boolean,
 * }} actionOptions
 * @param actionOptions.scale The ChromaJS color scale to use.
 * @param actionOptions.ratio The ratio along the scale.
 * @param actionOptions.highlighted Whether the node should be highlighted.
 */
export default function colorGradient(node, {
  scale: initScale, index: initIndex, total: initTotal,
}) {
  const halfScale = 0.5;
  const maxDarknessTotal = 10;
  let scale = initScale;
  let index = initIndex;
  let total = initTotal !== 0 ? initTotal : 0;

  function getColor() {
    const darknessRatio = total / maxDarknessTotal;
    const darkest = Math.min(halfScale + darknessRatio * halfScale, 1);
    const ratio = index * darkest / total;
    return scale(ratio);
  }

  function applyStyle(highlighted = false) {
    node.style.backgroundColor = getColor()
      .brighten(highlighted ? 0.5 : 0);
    node.style.borderColor = getColor()
      .darken();
  }

  function styleWithHighlight() {
    applyStyle(true);
  }

  function styleNoHighlight() {
    applyStyle();
  }

  node.addEventListener('mouseover', styleWithHighlight);
  node.addEventListener('mouseleave', styleNoHighlight);

  applyStyle();

  return {
    update({ scale: newScale, index: newIndex, total: newTotal }) {
      scale = newScale;
      index = newIndex;
      total = newTotal !== 0 ? newTotal : 0;
      applyStyle();
    },
    destroy() {
      node.removeEventListener('mouseover', styleWithHighlight);
      node.removeEventListener('mouseleave', styleNoHighlight);
    },
  };
}
