import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { getTop, getHeight } from '../utils/selection.js';

export function smoothSizePos(node, { start, end, duration }) {
  const smooth = tweened({ start: +start, end: +end }, {
    duration: duration ?? 100,
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

export function sizePos(node, { start, end }) {
  node.style.position = 'absolute';
  node.style.top = getTop(start);
  node.style.height = getHeight(end - start);
  return ({
    update({ start, end }) {
      node.style.top = getTop(start);
      node.style.height = getHeight(end - start);
    }
  });
}