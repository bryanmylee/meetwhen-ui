import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { getTop, getHeight } from '../utils/selection.js';

export function smoothSizePos(node, { start, end, duration }) {
  const startOfDay = start.startOf('day');
  const smooth = tweened({
    startInMs: start - startOfDay,
    endInMs: end - startOfDay,
  }, {
    duration: duration ?? 100,
    easing: cubicOut,
  });
  const unsub = smooth.subscribe(({ startInMs, endInMs }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(startInMs);
    node.style.height = getHeight(endInMs - startInMs);
  });
  return ({
    update({ start, end }) {
      const startOfDay = start.startOf('day');
      smooth.set({
        startInMs: start - startOfDay,
        endInMs: end - startOfDay,
      });
    },
    destroy() {
      unsub();
    }
  })
}

export function sizePos(node, { start, end }) {
  node.style.position = 'absolute';
  node.style.top = getTop(start - start.startOf('day'));
  node.style.height = getHeight(end - start);
  return ({
    update({ start, end }) {
      node.style.top = getTop(start - start.startOf('day'));
      node.style.height = getHeight(end - start);
    }
  });
}