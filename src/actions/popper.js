import { createPopper } from '@popperjs/core';

export function popperFollowMouseY(popoverNode,
    { referenceNode, clientY = 0, ...options }) {
  function generateGetBoundingClientRect(clientY) {
    const rect = referenceNode.getBoundingClientRect();
    return () => ({
      width: rect.width, height: 0,
      top: clientY, bottom: clientY,
      left: rect.left, right: rect.right,
    });
  }

  const virtualNode = ({
    getBoundingClientRect: generateGetBoundingClientRect(clientY),
    contextElement: referenceNode,
  });
  let instance = createPopper(virtualNode, popoverNode, options);

  return ({
    update({ referenceNode, clientY = 0, ...options }) {
      virtualNode.getBoundingClientRect = generateGetBoundingClientRect(clientY);
      instance.destroy();
      instance = createPopper(virtualNode, popoverNode, options);
      instance.update();
    },
    destroy() {
      instance.destroy();
    }
  })
}