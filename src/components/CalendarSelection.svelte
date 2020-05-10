<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import dayjs from 'dayjs';

  export let start;
  export let end;
  export let isActive;

  const endTimestamp = tweened(+end, {
    duration: 300,
    easing: cubicOut,
  });
  $: $endTimestamp = +end;
  $: console.log($endTimestamp);

  function getTop(start) {
    // The size of top is rowHeight * numHours from midnight.
    const numHours = start.hour() + start.minute() / 60;
    return `${numHours * 3}rem`;
  }

  function getLeft(start) {
    // The size of left is colWidth * numDays from today.
    const millisecondsBetween = start - dayjs().startOf('day');
    const numDays = Math.floor(millisecondsBetween / 1000 / 60 / 60 / 24);
    return `${numDays * 6}rem`;
  }

  function getHeight(start, end) {
    // Set the tail of the selection box based on the time released.
    // The height is rowHeight * (numQuarterHours between start and end
    // inclusive) / 4;
    const numQuarterHours = ((end - start) / 1000 / 60 / 15) + 1;
    return `${numQuarterHours / 4 * 3}rem`;
  }
</script>

<div
  class="selection-box"
  style="height:{getHeight(start, $endTimestamp)}; top:{getTop(start)}; left:{getLeft(start)}"
></div>

<style>
  .selection-box {
    grid-column: 1/2;
    position: absolute;
    width: var(--col-width);
    background-color: teal;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    pointer-events: none;
  }
</style>