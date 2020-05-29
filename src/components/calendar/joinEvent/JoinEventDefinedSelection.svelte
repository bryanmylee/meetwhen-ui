<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';

  import { isSelecting } from '../../../stores.js';
  import { getTop, getHeight } from '../../../utils/selection.js';

  export let start;
  export let end;
</script>

<div
  style="top:{getTop(start)};
         height:{getHeight(end - start)};"
  class:pass-through={$isSelecting}
></div>

<style>
  div {
    position: absolute;
    left: var(--select-collapse-width);
    width: var(--select-join-width);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: var(--primary-1);
    opacity: 0.5;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>