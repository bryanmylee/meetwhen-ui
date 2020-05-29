export function opacity(node, { opacity }) {
  node.style.opacity = opacity;
  return ({
    update({ opacity }) {
      node.style.opacity = opacity;
    }
  })
}