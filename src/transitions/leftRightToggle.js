import { cubicOut } from 'svelte/easing';

export function leftRight({
  delay: bothDelay = 0,
  duration: bothDuration = 200,
  easing: bothEasing = cubicOut,
}) {
  let leftCardWidth = 0;
  let leftCardHeight = 0;
  let rightCardWidth = 0;
  let rightCardHeight = 0;

  let sending = false;
  let receiving = false;

  function leftIn(node) {
    receiving = true;

    const style = getComputedStyle(node);
    leftCardWidth = parseFloat(style.width);
    leftCardHeight = parseFloat(style.height);
    const targetOpacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const deltaWidth = rightCardWidth - leftCardWidth;
    const deltaHeight = rightCardHeight - leftCardHeight;

    return () => {
      if (!sending) {
        receiving = false;
        return null;
      }
      sending = false;
      return {
        delay: bothDelay,
        duration: bothDuration,
        easing: bothEasing,
        css: (t, u) => `
          transform: ${transform} translate(${u * -leftCardWidth}px, 0);
          opacity: ${targetOpacity * t};
          width: ${rightCardWidth - deltaWidth * t}
          max-height: ${rightCardHeight - deltaHeight * t}px;
          min-height: ${rightCardHeight - deltaHeight * t}px;
        `,
        tick: () => node.style.position = 'initial',
      };
    };
  }

  function rightOut(node) {
    sending = true;

    const style = getComputedStyle(node);
    rightCardWidth = parseFloat(style.width);
    rightCardHeight = parseFloat(style.height);
    const targetOpacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;

    return () => {
      if (!receiving) {
        sending = false;
        return null;
      }
      receiving = false;
      return {
        delay: bothDelay,
        duration: bothDuration,
        easing: bothEasing,
        css: (t, u) => `
          transform: ${transform} translate(${u * rightCardWidth}px, 0);
          opacity: ${targetOpacity * t};
          width: ${rightCardWidth}px;
        `,
        tick: () => node.style.position = 'fixed',
      };
    };
  }

  function rightIn(node) {
    receiving = true;

    const style = getComputedStyle(node);
    rightCardWidth = parseFloat(style.width);
    rightCardHeight = parseFloat(style.height);
    const targetOpacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const deltaWidth = leftCardWidth - rightCardWidth;
    const deltaHeight = leftCardHeight - rightCardHeight;

    return () => {
      if (!sending) {
        receiving = false;
        return null;
      }
      sending = false;
      return {
        delay: bothDelay,
        duration: bothDuration,
        easing: bothEasing,
        css: (t, u) => `
          transform: ${transform} translate(${u * rightCardWidth}px, 0);
          opacity: ${targetOpacity * t};
          width: ${leftCardWidth - deltaWidth * t}px;
          max-height: ${leftCardHeight - deltaHeight * t}px;
          min-height: ${leftCardHeight - deltaHeight * t}px;
        `,
        tick: () => node.style.position = 'initial',
      };
    };
  }

  function leftOut(node) {
    sending = true;

    const style = getComputedStyle(node);
    leftCardWidth = parseFloat(style.width);
    leftCardHeight = parseFloat(style.height);
    const targetOpacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;

    return () => {
      if (!receiving) {
        sending = false;
        return null;
      }
      receiving = false;
      return {
        delay: bothDelay,
        duration: bothDuration,
        easing: bothEasing,
        css: (t, u) => `
          transform: ${transform} translate(${u * -leftCardWidth}px, 0);
          opacity: ${targetOpacity * t};
          width: ${leftCardWidth}px;
        `,
        tick: () => node.style.position = 'fixed',
      };
    };
  }

  return {
    leftIn,
    leftOut,
    rightIn,
    rightOut,
  };
}
