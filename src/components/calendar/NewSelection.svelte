<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import dayjs from 'dayjs';

  // Represents the actual start and end points of the user selection.
  export let start;
  export let end;

  // The tweened duration in one day.
  const durationPerDayInMs = tweened(900000, { // milliseconds in 15 minutes
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
    const numDaysSpan = Math.floor((end - start) / 86400000) + 1;
    for (let i = 0; i < numDaysSpan; i++) {
      newSelectionByDay.push({
        start: start.add(i, 'day'),
        end: start.add($durationPerDayInMs, 'ms'),
      });
    }
    selectionByDay = newSelectionByDay;
  }

  function getTop(start) {
    // The size of top is rowHeight * numHours from midnight.
    const numHoursFromMidnight = start.hour() + start.minute() / 60;
    return `${numHoursFromMidnight * 3}rem`;
  }

  function getLeft(start) {
    // The size of left is colWidth * numDays from today.
    const millisecondsFromToday = start - dayjs().startOf('day');
    const numDaysFromToday
        = Math.floor(millisecondsFromToday / 86400000); // ms per day
    return `${numDaysFromToday * 6}rem`;
  }

  function getHeight(durationPerDayInMs) {
    // Set the tail of the selection box based on the time released.
    // The height is rowHeight * (numQuarterHours between start and end) / 4;
    const numQuarterHours = durationPerDayInMs / 900000; // 1/4 hours per ms
    return `${numQuarterHours / 4 * 3}rem`;
  }
</script>

{#each selectionByDay as selection}
<div
  style="height:{getHeight($durationPerDayInMs)};
         top:{getTop(selection.start)};
         left:{getLeft(selection.start)}"
></div>
{/each}

<style>
  div {
    grid-column: 1/2;
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 1;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: none;
  }
</style>