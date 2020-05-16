<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import dayjs from 'dayjs';

  export let start;
  export let end;

  const MS_PER_DAY = 86400000;
  const MS_PER_HOUR = 3600000;
  const ROW_HEIGHT_IN_REM = 3;

  function getTop(start) {
    const numHoursFromMidnight = start.hour() + start.minute() / 60;
    return `${numHoursFromMidnight * ROW_HEIGHT_IN_REM}rem`;
  }

  function getHeight(start, end) {
    const durationInHours = (end - start) / MS_PER_HOUR;
    return `${durationInHours * ROW_HEIGHT_IN_REM}rem`;
  }
</script>

<div
  style="top:{getTop(start)};
         height:{getHeight(start, end)};"
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
</style>