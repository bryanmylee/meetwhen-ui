<script lang="ts" context="module">
  export interface LongTouch {
    touch: Touch;
    initClientX: number;
    initClientY: number;
    pending: boolean;
    active: boolean;
    timer: number;
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
  import { getTouchArray } from '@my/utils/touch';

  export let startDelay = 200;
  export let deviateLimit = 5;

  let tracked: Record<number, LongTouch> = {};

  function touchstart(event: TouchEvent) {
    dispatch('touchstart', { event });
    const changedTouches = getTouchArray(event.changedTouches);
    changedTouches.forEach(touch => track(touch, event));
  }

  function track(touch: Touch, event: TouchEvent) {
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
  }

  function touchmove(event: TouchEvent) {
    dispatch('touchmove', { event });
    const changedTouches = getTouchArray(event.changedTouches);
    changedTouches.forEach(touch => updateMovement(touch, event));
  }

  const getSquareDistance = (x1: number, x2: number, y1: number, y2: number) => {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  };

  function updateMovement(touch: Touch, event: TouchEvent) {
    const { identifier } = touch;
    const longTouch = tracked[identifier];
    if (longTouch == null) return;
    const { initClientX: x1, initClientY: y1 } = longTouch;
    const { clientX: x2, clientY: y2 } = touch;
    if (longTouch.active) {
      dispatch('longtouchmove', { event });
      return;
    }
    if (getSquareDistance(x1, x2, y1, y2) > Math.pow(deviateLimit, 2)
        && longTouch.pending) {
      longTouch.pending = false;
      untrack(touch, event);
    }
  }

  function touchend(event: TouchEvent) {
    const changedTouches = getTouchArray(event.changedTouches);
    changedTouches.forEach(touch => untrack(touch, event));
    dispatch('touchend', { event });
  }

  function untrack(touch: Touch, event: TouchEvent) {
    const { identifier } = touch;
    const longTouch = tracked[identifier];
    if (longTouch == null) return;
    if (longTouch.active) {
      dispatch('longtouchend', { event });
    }
    clearTimeout(longTouch.timer);
    delete tracked[identifier];
  }
</script>

<div
  on:touchstart={touchstart}
  on:touchmove={touchmove}
  on:touchcancel
  on:touchend={touchend}
  class="contents"
  >
  <slot/>
</div>

