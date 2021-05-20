import { cubicOut } from 'svelte/easing';
import { crossfade, fade } from 'svelte/transition';

export const [send, receive] = crossfade({
  duration: 10000,
  easing: cubicOut,
  fallback: (node, params) => fade(node, { ...params, duration: 200 }),
});
