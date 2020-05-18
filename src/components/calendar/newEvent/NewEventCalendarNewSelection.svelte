<script>
  import dayjs from 'dayjs';

  import { newSelectionDurationPerDayInMs } from '../../../stores.js';
  import { getTop, getHeight } from '../../../utils/selections.js';

  // Represents the start points of the user selection in this day.
  export let start = 0;
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