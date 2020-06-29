import { createPopper } from '@popperjs/core';

/**
 * Provides dynamic positioning for a popover element which follows the mouse y
 * position.
 * @param {HTMLElement} popoverNode The node acting as the popover.
 * @param {{
 *   targetNode: HTMLElement,
 *   clientY: number,
 *   popperOptions: Options
 * }} actionOptions
 * @param actionOptions.targetNode The target node of the popover.
 * mouse, and the popper options.
 * @param actionOptions.clientY The clientY of the mouse.
 * @param actionOptions.popperOptions The PopperJS options.
 */
export function popperFollowMouseY(popoverNode,
    { targetNode, popperOptions }) {
  let clientY = 0;

  function handleMouseMove(event) {
    clientY = event.clientY;
    virtualNode.getBoundingClientRect = generateGetBoundingClientRect();
    instance.update();
  }

  function generateGetBoundingClientRect() {
    const rect = targetNode.getBoundingClientRect();
    return () => ({
      width: rect.width, height: 0,
      top: clientY, bottom: clientY,
      left: rect.left, right: rect.right,
    });
  }

  const virtualNode = ({
    getBoundingClientRect: generateGetBoundingClientRect(),
    contextElement: targetNode,
  });

  let instance = createPopper(virtualNode, popoverNode, popperOptions);

  window.addEventListener('mousemove', handleMouseMove);

  return ({
    update({ targetNode, popperOptions }) {
      virtualNode.getBoundingClientRect();
      virtualNode.contextElement = targetNode;
      instance.destroy();
      instance = createPopper(virtualNode, popoverNode, popperOptions);
      instance.update();
    },
    destroy() {
      instance.destroy();
      window.removeEventListener('mousemove', handleMouseMove);
    }
  });
}

/**
 * Provides PopperJS positioning for a popover element.
 * @param {HTMLElement} popoverNode The node acting as the popover.
 * @param {{
 *   targetNode: HTMLElement,
 *   popperOptions: Options
 * }} actionOptions
 * @param actionOptions.targetNode The target node of the popover.
 * mouse, and the popper options.
 * @param actionOptions.popperOptions The PopperJS options.
 */
export function popper(popoverNode,
    { targetNode, popperOptions }) {

  let instance = createPopper(targetNode, popoverNode, popperOptions);

  return ({
    update({ targetNode, popperOptions }) {
      instance.destroy();
      instance = createPopper(targetNode, popoverNode, popperOptions);
      instance.update();
    },
    destroy() {
      instance.destroy();
    }
  });
}