import { FRAME_DURATION } from 'src/utils/nextFrame';

export function autoScrollToSelf(node, { marginTop = 0 } = {}) {
  const { offsetLeft, offsetTop } = node;
  setTimeout(() => {
    node.parentNode.scrollTo(offsetLeft, offsetTop + marginTop);
  }, FRAME_DURATION);
}

export function autoScrollToChild(node, { index = 0 } = {}) {
  const childNode = node.children[index];
  node.scrollTo(childNode.offsetLeft, childNode.offsetTop);
}
