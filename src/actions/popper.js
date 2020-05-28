import { createPopper } from '@popperjs/core';

export default function popper(node, { popup, ...options }) {
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