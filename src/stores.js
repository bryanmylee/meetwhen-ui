import { writable } from 'svelte/store';
import chroma from 'chroma-js';

export const user = writable({});

const colors = ['GnBu', 'BuGn', 'PuBuGn', 'PuRd', 'YlOrRd'];
function getColorScale(initialColors = colors[0]) {
  const scale = writable(chroma.scale(initialColors));
  return {
    subscribe: scale.subscribe,
    set: (colors) => scale.set(chroma.scale(colors)),
  }
}

export const colorScale = getColorScale();