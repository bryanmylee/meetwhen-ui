<script>
  import dayjs from 'dayjs';

  import {
    getMergedIntervals,
    splitIntervalsOnMidnight,
  } from '../../../utils/intervals.js';
  import { newSelectionDurationPerDayInMs } from '../../../stores.js';
  import { getMultiDaySelection } from '../../../utils/selections.js';

  import CalendarIndexColumn from '../CalendarIndexColumn.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import JoinEventCalendarUnavailableColumnOverlay
      from './JoinEventCalendarUnavailableColumnOverlay.svelte';
  import JoinEventCalendarOtherUsersColumnOverlay
      from './JoinEventCalendarOtherUsersColumnOverlay.svelte';
  import JoinEventCalendarDefinedSelection
      from './JoinEventCalendarDefinedSelection.svelte';
  import JoinEventCalendarNewSelection
      from './JoinEventCalendarNewSelection.svelte';

  // Event details.
  export let eventIntervals = [];
  let eventIntervalsSplitOnMidnight = [];
  $: eventIntervalsSplitOnMidnight = splitIntervalsOnMidnight(eventIntervals);

  export let userIntervalsByUsername = {};
  let mergedIntervals = [];
  $: mergedIntervals
      = splitIntervalsOnMidnight(getMergedIntervals(userIntervalsByUsername));
  // The maximum number of usernames in all intervals.
  let maxUsernames = 0;
  $: maxUsernames = mergedIntervals.reduce((max, interval) => {
    const currCount = interval.usernames.length;
    return max >= currCount ? max : currCount;
  }, 0);

  // User selections.
  export let history;
  let selections = [];
  $: selections = $history.current().selections;

  let daysToShow = [];
  $: {
    daysToShow = [eventIntervalsSplitOnMidnight[0].start.startOf('day')];
    for (const interval of eventIntervalsSplitOnMidnight.slice(1)) {
      const { length } = daysToShow;
      if (!daysToShow[length - 1].isSame(interval.start, 'day')) {
        daysToShow.push(interval.start.startOf('day'));
      }
    }
  }
  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
    
  const MS_PER_MINUTE = 60000;

  // The new selection being made.
  let newSelection = null;
  // The current selection split into different days.
  let newSelections = [];
  $: {
    if (newSelection != null) {
      newSelections = getMultiDaySelection(newSelection);
      $newSelectionDurationPerDayInMs
          = newSelections[0].end - newSelections[0].start;
    } else {
      newSelections = [];
      $newSelectionDurationPerDayInMs = 15 * MS_PER_MINUTE;
    }
  }

  function startSelection(e) {
    const { datetime } = e.detail;
    newSelection = ({
      start: datetime,
      // datetime represents the start of the cell.
      // Add 15 minutes to account for the time in the last cell.
      end: datetime.add(15, 'minute'),
    });
  }

  function gridDrag(e) {
    const { datetime } = e.detail;
    // datetime represents the start of the cell.
    // Add 15 minutes to account for the time in the last cell.
    newSelection = ({ ...newSelection,
      end: datetime.add(15, 'minute'),
    });
  }

  function stopSelection() {
    if (!newSelection || !newSelection.start || !newSelection.end) return;
    // Update history
    history.push({
      // New state of selections includes selections from the current state.
      selections: [
        ...$history.current().selections,
        ...getMultiDaySelection(newSelection),
      ],
    });
    newSelection = null;
  }

</script>

<div id="picker" class="card">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div id="body" on:mouseleave={stopSelection}>
    <CalendarIndexColumn />
    {#each daysToShow as day}
      <CalendarDayColumn {day} {hours}
        on:startSelection={startSelection}
        on:gridDrag={gridDrag}
        on:stopSelection={stopSelection}
      >
        <!-- Render unavailable intervals -->
        <JoinEventCalendarUnavailableColumnOverlay
          eventIntervals={eventIntervalsSplitOnMidnight.filter((interval) =>
              interval.start.isSame(day, 'day')
          )}
        />
        <!-- Render other user selections -->
        <JoinEventCalendarOtherUsersColumnOverlay
          mergedIntervals={mergedIntervals.filter((interval) =>
              interval.start.isSame(day, 'day')
          )}
          {maxUsernames}
        />
        <!-- Render current user selections -->
        {#each selections.filter((selection) =>
            selection.start.isSame(day, 'date')) as selection}
          <JoinEventCalendarDefinedSelection {...selection} />
        {/each}
        <!-- Render current user new selections -->
        {#each newSelections.filter((selection) =>
            selection.start.isSame(day, 'date')) as selection}
          <JoinEventCalendarNewSelection start={selection.start} />
        {/each}
      </CalendarDayColumn>
    {/each}
  </div>
</div>

<style>
  :root {
    --index-col-width: 4rem;
    --header-row-height: 2rem;
    --col-width: 6rem;
    --row-height: 3rem;
  }

  #picker {
    width: auto;
    margin-bottom: 1em;
    overflow: scroll;
    scroll-behavior: smooth;
  }

  #body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
  }

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>