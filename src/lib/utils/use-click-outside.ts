import type { Action } from '$lib/typings/action';

export const clickOutside: Action<() => void> = (node, callback) => {
  const click = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
      callback();
    }
  };

  document.addEventListener('click', click, true);
  return {
    destroy() {
      document.removeEventListener('click', click, true);
    },
  };
};
