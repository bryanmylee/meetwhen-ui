<script>
  import dayjs from 'dayjs';

  import {
    getMergedIntervals,
    splitIntervalsOnMidnight,
  } from '../../../utils/intervals.js';

  import CalendarIndexColumn from '../CalendarIndexColumn.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import JoinEventCalendarUnavailableColumnOverlay
      from './JoinEventCalendarUnavailableColumnOverlay.svelte';
  import JoinEventCalendarOtherUserColumnOverlay
      from './JoinEventCalendarOtherUserColumnOverlay.svelte';

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
</script>

<div id="picker" class="card">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div id="body">
    <CalendarIndexColumn />
    {#each daysToShow as day}
      <CalendarDayColumn {day} {hours}>
        <!-- Render unavailable intervals -->
        <JoinEventCalendarUnavailableColumnOverlay
          eventIntervals={eventIntervalsSplitOnMidnight.filter((interval) =>
              interval.start.isSame(day, 'day')
          )}
        />
        <!-- Render other user selections -->
        <JoinEventCalendarOtherUserColumnOverlay
          mergedIntervals={mergedIntervals.filter((interval) =>
              interval.start.isSame(day, 'day')
          )}
          {maxUsernames}
        />
        <!-- Render current user selections -->
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