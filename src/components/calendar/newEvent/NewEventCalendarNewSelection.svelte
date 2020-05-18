<script>
  import dayjs from 'dayjs';

  import { newSelectionDurationPerDayInMs } from '../../../stores.js';

  // Represents the actual start and end points of the user selection.
  export let start = 0;

  const MS_PER_HOUR = 3600000;
  const ROW_HEIGHT_IN_REM = 3;

  function getTop(start) {
    const numHoursFromMidnight = start.hour() + start.minute() / 60;
    return `${numHoursFromMidnight * ROW_HEIGHT_IN_REM}rem`;
  }

  function getHeight(durationInMs) {
    const durationInHours = durationInMs / MS_PER_HOUR;
    return `${durationInHours * ROW_HEIGHT_IN_REM}rem`;
  }
</script>

<div
  style="top:{getTop(start)};
        height:{getHeight($newSelectionDurationPerDayInMs)};"
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