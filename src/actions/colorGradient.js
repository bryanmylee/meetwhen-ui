/**
 * Programmatically sets the background color of an element based on a color
 * scale, with highlighting on mouseover.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   scale: chroma.Scale,
 *   ratio: number,
 *   highlighted: boolean,
 *   opacitySensitivity: number
 *  }} actionOptions
 * @param actionOptions.scale The ChromaJS color scale to use.
 * @param actionOptions.ratio The ratio along the scale.
 * @param actionOptions.highlighted Whether the node should be highlighted.
 * @param actionOptions.opacitySensitivity How sensitive the opacity is to
 * ratio.
 */
export default function colorGradient(node,
    { scale, ratio, opacitySensitivity = 0.6 }) {
  function applyStyle(scale, ratio, highlighted = false) {
    node.style.backgroundColor = scale(ratio)
        .alpha(ratio * opacitySensitivity + (1 - opacitySensitivity))
        .brighten(highlighted ? 0.5 : 0);
    node.style.borderColor = scale(ratio)
        .darken();
  }

  function styleWithHighlight() {
    applyStyle(scale, ratio, true);
  }

  function styleNoHighlight() {
    applyStyle(scale, ratio);
  }

  node.addEventListener('mouseover', styleWithHighlight);
  node.addEventListener('mouseleave', styleNoHighlight);

  applyStyle(scale, ratio);

  return ({
    update({ scale, ratio }) {
      applyStyle(scale, ratio);
    },
    destroy() {
      node.removeEventListener('mouseover', styleWithHighlight);
      node.removeEventListener('mouseleave', styleNoHighlight);
    }
  })
}