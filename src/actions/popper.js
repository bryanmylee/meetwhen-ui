import { createPopper } from '@popperjs/core';

export function popper(node, { popup, ...options }) {
  let instance = popup == null ? null : createPopper(node, popup, options);

  return ({
    update({ popup, ...options }) {
      if (instance) instance.destroy();
      instance = popup == null ? null : createPopper(node, popup, options);
    },
    destroy() {
      if (instance) {
        instance.destroy();
        instance = null;
      }
    }
  });
}

export function popperFollowMouseY(node, { popup, mouseY = 0, ...options }) {
  function generateGetBoundingClientRect(mouseY) {
    const rect = node.getBoundingClientRect();
    return () => ({
      width: rect.width, height: 0,
      top: mouseY, bottom: mouseY,
      left: rect.left, right: rect.right,
    });
  }

  const virtualElement = ({
    getBoundingClientRect: generateGetBoundingClientRect(),
    contextElement: node,
  });
  let instance = popup == null ? null : createPopper(virtualElement, popup, options);

  return ({
    update({ popup, mouseY = 0, ...options }) {
      virtualElement.getBoundingClientRect = generateGetBoundingClientRect(mouseY);
      instance = popup == null ? null : createPopper(virtualElement, popup, options);
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