import { createPopper } from '@popperjs/core';

/**
 * Provides dynamic positioning for a popover element which follows the mouse y
 * position.
 * @param {HTMLElement} popoverNode The element acting as the popover.
 * @param {{
 *   referenceNode: HTMLElement,
 *   clientY: number,
 *   ...options: Options
 * }} actionOptions
 * @param actionOptions.referenceNode The reference element of the popover.
 * mouse, and the popper options.
 * @param actionOptions.clientY The clientY of the mouse.
 * @param actionOptions.options The PopperJS options.
 */
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