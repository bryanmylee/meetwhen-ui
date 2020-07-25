export function autoScrollSelf(node, { hour } = {}) {
  const rowHeight = node.offsetHeight / 24;
  const BUFFER = 50;
  node.parentNode.scrollTo(0, hour * rowHeight - BUFFER);
}
