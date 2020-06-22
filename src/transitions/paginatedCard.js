import { cubicOut } from 'svelte/easing';

export function cardIn(node, {
  delay = 0,
  duration = 200,
  easing = cubicOut,
  x = 1000,
  opacity = 0,
}) {
  const style = getComputedStyle(node);
  const targetOpacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;
  const od = targetOpacity * (1 - opacity);

  return ({
    delay,
    duration,
    easing,
    css: (_, u) => `
      transform: ${transform} translate(${u * x}px, 0);
      opacity: ${targetOpacity - (od * u)};
    `,
    tick: _ => node.style.position = 'unset',
  })
}

export function cardOut(node, {
  delay = 0,
  duration = 200,
  easing = cubicOut,
  x = 400,
  opacity = 0,
}) {
  const style = getComputedStyle(node);
  const targetOpacity = +style.opacity;
  const targetWidth = style.width;
  const transform = style.transform === 'none' ? '' : style.transform;
  const od = targetOpacity * (1 - opacity);

  return ({
    delay,
    duration,
    easing,
    css: (_, u) => `
      transform: ${transform} translate(${u * x}px, 0);
      opacity: ${targetOpacity - (od * u)};
      width: ${targetWidth};
    `,
    tick: _ => node.style.position = 'absolute',
  })
}