<script lang="ts" context="module">
  export interface LongTouch {
    touch: Touch;
    initClientX: number;
    initClientY: number;
    pending: boolean;
    active: boolean;
    /* eslint-disable no-undef */
    timer: NodeJS.Timeout;
  }

  export interface LongTouchEvent {
    touchstart: {
      event: TouchEvent;
    };
    touchmove: {
      event: TouchEvent;
    };
    touchend: {
      event: TouchEvent;
    };
    longtouchstart: {
      event: TouchEvent;
    };
    longtouchmove: {
      event: TouchEvent;
    };
    longtouchend: {
      event: TouchEvent;
    };
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<LongTouchEvent>();
  import { getTouchArray } from '$lib/utils/touch';
  import { cssVars } from '$lib/utils/use-css-vars';

  export let startDelay = 300;
  export let deviateLimit = 5;

  let tracked: Record<number, LongTouch> = {};

  const touchstart = (event: TouchEvent) => {
    disableSelect();
    dispatch('touchstart', { event });
    const changedTouches = getTouchArray(event.changedTouches);
    changedTouches.forEach((touch) => track(touch, event));
  };

  const track = (touch: Touch, event: TouchEvent) => {
    indicateLongTouch(touch);
    tracked[touch.identifier] = {
      touch,
      initClientX: touch.clientX,
      initClientY: touch.clientY,
      pending: true,
      active: false,
      timer: setTimeout(() => {
        const longTouch = tracked[touch.identifier];
        if (longTouch.pending) {
          longTouch.pending = false;
          longTouch.active = true;
          dispatch('longtouchstart', { event });
        }
      }, startDelay),
    };
  };

  const touchmove = (event: TouchEvent) => {
    dispatch('touchmove', { event });
    const changedTouches = getTouchArray(event.changedTouches);
    changedTouches.forEach((touch) => updateMovement(touch, event));
  };

  const getSquareDistance = (x1: number, x2: number, y1: number, y2: number) => {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  };

  const updateMovement = (touch: Touch, event: TouchEvent) => {
    const { identifier } = touch;
    const longTouch = tracked[identifier];
    if (longTouch == null) {
      removeIndicator();
      return;
    }
    const { initClientX: x1, initClientY: y1 } = longTouch;
    const { clientX: x2, clientY: y2 } = touch;
    if (longTouch.active) {
      dispatch('longtouchmove', { event });
      return;
    }
    if (getSquareDistance(x1, x2, y1, y2) > Math.pow(deviateLimit, 2) && longTouch.pending) {
      longTouch.pending = false;
      untrack(touch, event);
    }
  };

  const touchend = (event: TouchEvent) => {
    enableSelect();
    const changedTouches = getTouchArray(event.changedTouches);
    changedTouches.forEach((touch) => untrack(touch, event));
    removeIndicator();
    dispatch('touchend', { event });
  };

  const untrack = (touch: Touch, event: TouchEvent) => {
    const { identifier } = touch;
    const longTouch = tracked[identifier];
    if (longTouch == null) {
      return;
    }
    if (longTouch.active) {
      dispatch('longtouchend', { event });
    }
    clearTimeout(longTouch.timer);
    delete tracked[identifier];
  };

  const disableSelect = () => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.classList.add('select-none');
  };

  const enableSelect = () => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.classList.remove('select-none');
  };

  let indicatorElement: HTMLDivElement;
  const indicateLongTouch = ({ clientX, clientY }: Touch) => {
    if (typeof document === 'undefined') {
      return;
    }
    if (indicatorElement !== undefined) {
      try {
        document.body.removeChild(indicatorElement);
      } catch {}
    }
    indicatorElement = document.createElement('div');
    indicatorElement.id = 'indicator';
    indicatorElement.style.left = `${clientX}px`;
    indicatorElement.style.top = `${clientY}px`;
    cssVars(indicatorElement, { startDelay: `${startDelay}ms` });
    document.body.appendChild(indicatorElement);
    requestAnimationFrame(() => {
      indicatorElement.classList.add('expanded');
      setTimeout(() => {
        removeIndicator();
      }, startDelay + 500);
    });
  };

  const removeIndicator = () => {
    if (indicatorElement === undefined) {
      return;
    }
    document.body.removeChild(indicatorElement);
    indicatorElement = undefined;
  };
</script>

<div
  on:touchstart={touchstart}
  on:touchmove={touchmove}
  on:touchcancel
  on:touchend={touchend}
  class="contents"
>
  <slot />
</div>

<style lang="postcss">
  :global(#indicator) {
    @apply fixed z-50 w-28 h-28 rounded-full pointer-events-none bg-primary-fifty;
    transform: translate(-50%, -50%) scale(0.25);
    transition: transform var(--startDelay) ease-out,
      opacity 300ms ease-out calc(var(--startDelay) + 200ms), border 0ms var(--startDelay);
  }

  :global(#indicator.expanded) {
    @apply border-4 border-primary-darker;
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }

  :global(.dark #indicator.expanded) {
    @apply border-white;
  }
</style>
