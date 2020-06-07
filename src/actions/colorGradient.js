export default function colorGradient(node,
    { scale, ratio, highlighted, opacitySensitivity = 0.6 }) {
  function style(scale, ratio, highlighted) {
    node.style.backgroundColor = scale(ratio)
        .alpha(ratio * opacitySensitivity + (1 - opacitySensitivity))
        .brighten(highlighted ? 0.5 : 0);
    node.style.borderColor = scale(ratio)
        .darken();
  }
  style(scale, ratio, highlighted);
  return ({
    update({ scale, ratio, highlighted }) {
      style(scale, ratio, highlighted);
    }
  })
}