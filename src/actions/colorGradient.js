import chroma from 'chroma-js';
const scale = chroma.scale('YlGnBu');
// const scale = chroma.scale('RdPu');
// const scale = chroma.scale('YlOrRd');

export default function colorGradient(node, {
  ratio,
  bgSensitivity = 0.8,
  borderSensitivity = 0.5
}) {
  node.style.backgroundColor = scale(ratio)
      .alpha(ratio * bgSensitivity + (1 - bgSensitivity));
  node.style.borderColor = scale(ratio)
      .alpha(ratio * borderSensitivity + (1 - borderSensitivity)).darken();
  return ({
    update({ ratio }) {
      node.style.backgroundColor = scale(ratio).alpha(ratio * 0.8 + 0.2);
      node.style.borderColor = scale(ratio).alpha(ratio * 0.6 + 0.4).darken();
    }
  })
}