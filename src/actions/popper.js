import { createPopper } from '@popperjs/core';

/**
 * Provides dynamic positioning for a popover element which follows the mouse y
 * position.
 * @param {HTMLElement} popoverNode The node acting as the popover.
 * @param {{
 *   targetNode: HTMLElement,
 *   clientY: number,
 *   options: Options
 * }} actionOptions
 * @param actionOptions.targetNode The target node of the popover.
 * mouse, and the popper options.
 * @param actionOptions.clientY The clientY of the mouse.
 * @param actionOptions.options The PopperJS options.
 */
export function popperFollowMouseY(popoverNode,
    { targetNode, clientY = 0, popperOptions }) {
  function generateGetBoundingClientRect(clientY) {
    const rect = targetNode.getBoundingClientRect();
    return () => ({
      width: rect.width, height: 0,
      top: clientY, bottom: clientY,
      left: rect.left, right: rect.right,
    });
  }

  const virtualNode = ({
    getBoundingClientRect: generateGetBoundingClientRect(clientY),
    contextElement: targetNode,
  });
  let instance = createPopper(virtualNode, popoverNode, popperOptions);

  return ({
    update({ targetNode, clientY = 0, popperOptions }) {
      virtualNode.getBoundingClientRect = generateGetBoundingClientRect(clientY);
      instance.destroy();
      instance = createPopper(virtualNode, popoverNode, popperOptions);
      instance.update();
    },
    destroy() {
      instance.destroy();
    }
  })
}