import { writable, derived } from 'svelte/store';
import chroma from 'chroma-js';

export const user = writable({});
export const isLoggedIn = derived(user, ($user) => $user.accessToken != null);

const colors = ['GnBu', 'BuGn', 'PuBuGn', 'PuRd', 'YlOrRd'];
function getColorScale(initialColors = colors[0]) {
  const scale = writable(chroma.scale(initialColors));
  return {
    subscribe: scale.subscribe,
    set: (colors) => scale.set(chroma.scale(colors)),
  }
}

export const colorScale = getColorScale();