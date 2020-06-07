import { createPopper } from '@popperjs/core';

export function popperFollowMouseY(referenceNode,
    { popoverNode, mouseY = 0, ...options }) {
  function generateGetBoundingClientRect(mouseY) {
    const rect = referenceNode.getBoundingClientRect();
    return () => ({
      width: rect.width, height: 0,
      top: mouseY, bottom: mouseY,
      left: rect.left, right: rect.right,
    });
  }

  const virtualNode = ({
    getBoundingClientRect: generateGetBoundingClientRect(),
    contextElement: referenceNode,
  });
  let instance = popoverNode == null
      ? null : createPopper(virtualNode, popoverNode, options);

  return ({
    update({ popoverNode, mouseY = 0, ...options }) {
      virtualNode.getBoundingClientRect = generateGetBoundingClientRect(mouseY);
      instance = popoverNode == null
        ? null : createPopper(virtualNode, popoverNode, options);
      if (instance) instance.update();
    },
    destroy() {
      if (instance) {
        instance.destroy();
        instance = null;
      }
    }
  })
}