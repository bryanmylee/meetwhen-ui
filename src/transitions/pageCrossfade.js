import { sineOut } from 'svelte/easing';

const duration = 150;

export function fadeIn(node) {
  return {
    duration,
    delay: duration,
    easing: sineOut,
    css: (t) => `opacity: ${t}`,
    tick: () => node.style.position = 'initial',
  };
}

export function fadeOut(node) {
  return {
    duration,
    delay: 0,
    easing: sineOut,
    css: (t) => `opacity: ${t}`,
    tick: () => node.style.position = 'fixed',
  };
}
