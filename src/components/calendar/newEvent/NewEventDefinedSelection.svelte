<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';

  import { isSelecting } from '../../../stores.js';
  import { getTop, getHeight } from '../../../utils/selections.js';

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
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>