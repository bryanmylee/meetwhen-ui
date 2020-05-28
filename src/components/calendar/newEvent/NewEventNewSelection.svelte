<script>
  import { fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';

  import { getTop, getHeight } from '../../../utils/selections.js';

  // Represents the start points of the user selection in this day.
  export let start;
  export let end;

  const durationInMs = tweened(0, {
    duration: 300,
    easing: cubicOut,
  });

  const MS_PER_MINUTE = 60000;
  $: $durationInMs = Math.max(end - start, 15 * MS_PER_MINUTE);
</script>

<div transition:fade
  style="top:{getTop(start)};
         height:{getHeight($durationInMs)};"
></div>

<style>
  div {
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 1;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: none;
  }
</style>