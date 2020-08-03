import { cubicOut } from 'svelte/easing';

export function cardIn(node, {
  delay = 0,
  duration = 200,
  easing = cubicOut,
  opacity = 0,
  left = false,
}) {
  const style = getComputedStyle(node);
  const targetWidth = parseFloat(style.width);
  const targetOpacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;
  const od = targetOpacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (_, u) => `
      transform: ${transform} translate(${u * targetWidth * (left ? -1 : 1)}px, 0);
      opacity: ${targetOpacity - od * u};
    `,
    tick: () => node.style.position = 'unset',
  };
}

export function cardOut(node, {
  delay = 0,
  duration = 200,
  easing = cubicOut,
  opacity = 0,
  left = false,
}) {
  const style = getComputedStyle(node);
  const targetOpacity = +style.opacity;
  const targetWidth = parseFloat(style.width);
  const transform = style.transform === 'none' ? '' : style.transform;
  const od = targetOpacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (_, u) => `
      transform: ${transform} translate(${u * targetWidth * (left ? -1 : 1)}px, 0);
      opacity: ${targetOpacity - od * u};
      width: ${targetWidth}px;
    `,
    tick: () => node.style.position = 'absolute',
  };
}
