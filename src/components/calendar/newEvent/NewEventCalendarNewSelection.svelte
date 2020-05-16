<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import dayjs from 'dayjs';

  // Represents the actual start and end points of the user selection.
  export let start = 0;
  export let end = 0;

  const MS_PER_DAY = 86400000;
  const MS_PER_HOUR = 3600000;
  const ROW_HEIGHT_IN_REM = 3;
  const COL_WIDTH_IN_REM = 6;

  // The tweened duration in one day.
  const durationPerDayInMs = tweened(end - start, {
    duration: 300,
    easing: cubicOut,
  });
  $: $durationPerDayInMs = end
      .date(start.date())
      .month(start.month())
      .year(start.year()) - start;

  // Split the selection across multiple days.
  let selectionByDay = [];
  $: {
    const newSelectionByDay = [];
    // Determine how many days are included from start to end.
    const numDaysSpan = Math.floor((end - start) / MS_PER_DAY) + 1;
    for (let i = 0; i < numDaysSpan; i++) {
      newSelectionByDay.push({
        start: start.add(i, 'day'),
        end: start.add($durationPerDayInMs, 'ms'),
      });
    }
    selectionByDay = newSelectionByDay;
  }

  function getTop(start) {
    const numHoursFromMidnight = start.hour() + start.minute() / 60;
    return `${numHoursFromMidnight * ROW_HEIGHT_IN_REM}rem`;
  }

  function getHeight(durationInMs) {
    const durationInHours = durationInMs / MS_PER_HOUR;
    return `${durationInHours * ROW_HEIGHT_IN_REM}rem`;
  }
</script>

{#each selectionByDay as selection}
  <div
    style="top:{getTop(selection.start)};
          height:{getHeight($durationPerDayInMs)};"
  ></div>
{/each}

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