import { sineOut } from 'svelte/easing';

const duration = 150;

export function fadeIn() {
  return {
    duration,
    delay: duration,
    easing: sineOut,
    css: (t) => `opacity: ${t}`,
  };
}

export function fadeOut() {
  return {
    duration,
    delay: 0,
    easing: sineOut,
    css: (t) => `opacity: ${t}`,
  };
}
