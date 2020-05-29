import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { getTop, getHeight } from '../utils/selections.js';

export function smoothSizePos(node, { start, end }) {
  const smooth = tweened({ start: +start, end: +end }, {
    duration: 300,
    easing: cubicOut,
  });
  const unsub = smooth.subscribe(({ start, end }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(start);
    node.style.height = getHeight(end - start);
  });
  return ({
    update({ start, end }) {
      smooth.set({ start: +start, end: +end });
    },
    destroy() {
      unsub();
    }
  })
}