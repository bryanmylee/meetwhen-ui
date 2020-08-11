<script>
  import { calendarSelectionEnabled } from '../stores';

  export let quarter;
</script>

<div
  class:enabled={$calendarSelectionEnabled}
  class:midnight={quarter.hour() === 0 && quarter.minute() === 0}
  data-quarter-hour-target data-day-ms={+quarter.startOf('day')}
  data-hour={quarter.hour() + Math.floor(quarter.minute() / 15) * 0.25}
/>

<style>
  div {
    width: 100%;
    height: 100%;
    min-height: calc(var(--row-height) / 4);
    border-bottom: 1px solid transparent;
  }

  div:first-of-type {
    border-top: 1px solid var(--grey-200);
  }

  div:nth-child(4n) {
    border-bottom: 1px solid var(--grey-200);
  }

  div.enabled {
    cursor: pointer;
  }

  div.enabled:hover {
    background-color: var(--primary-500);
    opacity: 0.2;
    border-radius: 5px;
  }

  div.midnight {
    border-top: 3px solid var(--grey-200);
  }
</style>