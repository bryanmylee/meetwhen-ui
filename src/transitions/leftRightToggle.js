import { cubicOut } from 'svelte/easing';

export function leftRight({
  delay: bothDelay = 0,
  duration: bothDuration = 200,
  easing: bothEasing = cubicOut,
}) {
  let receivingNode = null;
  let sendingNode = null;

  function fly(node, {
    isLeft,
    isIntro,
    otherStyle,
    delay = bothDelay,
    duration = bothDuration,
    easing = bothEasing,
  } = {}) {
    const style = getComputedStyle(node);
    const width = parseFloat(style.width);
    const height = parseFloat(style.height);
    const dx = width * (isLeft ? -1 : 1);
    const dw = parseFloat(otherStyle.width) - width;
    const dh = parseFloat(otherStyle.height) - height;
    const transform = style.transform === 'none' ? '' : style.transform;
    const opacity = +style.opacity;

    return {
      delay,
      duration,
      easing,
      css: (t, u) => {
        if (isIntro) {
          return `
            transform: ${transform} translate(${u * dx}px, 0);
            opacity: ${t * opacity};
            width: ${width + dw * u}px;
            min-height: ${height + dh * u}px;
            max-height: ${height + dh * u}px;
          `;
        }
        return `
          transform: ${transform} translate(${u * dx}px, 0);
          opacity: ${t * opacity};
          width: ${width}px;
        `;
      },
      tick: () => node.style.position = isIntro ? 'initial' : 'fixed',
    };
  }

  function transition(isLeft, isIntro) {
    return (node, params) => {
      if (isIntro) {
        receivingNode = node;
      } else {
        sendingNode = node;
      }

      return () => {
        if (isIntro && sendingNode != null) {
          const otherStyle = getComputedStyle(sendingNode);
          sendingNode = null;
          return fly(node, { isLeft, isIntro, otherStyle, ...params });
        }
        if (!isIntro && receivingNode != null) {
          const otherStyle = getComputedStyle(receivingNode);
          receivingNode = null;
          return fly(node, { isLeft, isIntro, otherStyle, ...params });
        }

        if (isIntro) {
          receivingNode = null;
        } else {
          sendingNode = null;
        }
        return null;
      };
    };
  }

  return {
    leftIntro: transition(true, true),
    leftOutro: transition(true, false),
    rightIntro: transition(false, true),
    rightOutro: transition(false, false),
  };
}
