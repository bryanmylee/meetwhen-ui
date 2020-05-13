<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import dayjs from 'dayjs';

  export let start;
  export let end;

  const endInMs = tweened(+end, {
    duration: 300,
    easing: cubicOut,
  });
  $: $endInMs = +end;

  function getTop(start) {
    // The size of top is rowHeight * numHours from midnight.
    const numHours = start.hour() + start.minute() / 60;
    return `${numHours * 3}rem`;
  }

  function getLeft(start) {
    // The size of left is colWidth * numDays from today.
    const millisecondsBetween = start - dayjs().startOf('day');
    const numDays
        = Math.floor(millisecondsBetween / 86400000); // milliseconds per day
    return `${numDays * 6}rem`;
  }

  function getHeight(start, end) {
    // Set the tail of the selection box based on the time released.
    // The height is rowHeight * (numQuarterHours between start and end) / 4;
    const numQuarterHours = (end - start) / 1000 / 60 / 15;
    return `${numQuarterHours / 4 * 3}rem`;
  }
</script>

<div
  style="height:{getHeight(start, $endInMs)};
         top:{getTop(start)};
         left:{getLeft(start)}"
></div>

<style>
  div {
    grid-column: 1/2;
    position: absolute;
    width: var(--col-width);
    border-radius: 2px;
    background-color: var(--primary-1);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: none;
  }

  .active {
    background-color: var(--primary-1);
    opacity: 1;
  }
</style>