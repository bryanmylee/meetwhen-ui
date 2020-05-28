import { writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

export const newSelectionDurationPerDayInMs = tweened(0, {
  duration: 300,
  easing: cubicOut,
});

export const isSelecting = writable(false);