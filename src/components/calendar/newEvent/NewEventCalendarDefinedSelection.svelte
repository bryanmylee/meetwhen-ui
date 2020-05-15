<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import dayjs from 'dayjs';

  export let start;
  export let end;

  const MS_PER_DAY = 86400000;
  const MS_PER_HOUR = 3600000;
  const ROW_HEIGHT_IN_REM = 3;
  const COL_WIDTH_IN_REM = 6;

  function getTop(start) {
    const numHoursFromMidnight = start.hour() + start.minute() / 60;
    return `${numHoursFromMidnight * ROW_HEIGHT_IN_REM}rem`;
  }

  function getLeft(start) {
    const millisecondsFromToday = start - dayjs().startOf('day');
    const numDaysFromToday = Math.floor(millisecondsFromToday / MS_PER_DAY);
    return `${numDaysFromToday * COL_WIDTH_IN_REM}rem`;
  }

  function getHeight(start, end) {
    const durationInHours = (end - start) / MS_PER_HOUR;
    return `${durationInHours * ROW_HEIGHT_IN_REM}rem`;
  }
</script>

<div
  style="height:{getHeight(start, end)};
         top:{getTop(start)};
         left:{getLeft(start)}"
></div>

<style>
  div {
    grid-column: 1/2;
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: all;
  }
</style>