import { FRAME_DURATION } from 'src/utils/nextFrame';

export function autoScrollSelf(node, { hour } = {}) {
  const rowHeight = node.offsetHeight / 24;
  const BUFFER = 50;
  setTimeout(() => {
    node.parentNode.scrollTo(0, hour * rowHeight - BUFFER);
  }, FRAME_DURATION);
}

export function autoScrollToChild(node, { index = 0 } = {}) {
  const childNode = node.children[index];
  node.scrollTo(childNode.offsetLeft, childNode.offsetTop);
}
