<script>
  import dayjs from 'dayjs';

  import { getMergedIntervals } from '../../../utils/intervals.js';

  import CalendarIndexColumn from '../CalendarIndexColumn.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import JoinEventCalendarUnavailableColumnOverlay
      from './JoinEventCalendarUnavailableColumnOverlay.svelte';

  // Event details.
  export let eventIntervals = [];
  let eventIntervalsByDay = {};
  $: {
    eventIntervalsByDay = {};
    for (const eventInterval of eventIntervals) {
      const { start } = eventInterval;
      // Converted to a string
      const key = start.startOf('day');
      if (eventIntervalsByDay.hasOwnProperty(key)) {
        eventIntervalsByDay[key].push(eventInterval);
      } else {
        eventIntervalsByDay[key] = [eventInterval];
      }
    }
  }
  export let userIntervalsByUsername = {};
  let mergedIntervals = [];
  $: {
    console.log(userIntervalsByUsername);
    mergedIntervals = getMergedIntervals(userIntervalsByUsername);
    console.log(mergedIntervals);
  }

  // User selections.
  export let history;
  $: selections = $history.current().selections;


  let daysToShow = [];
  $: daysToShow = Object.values(eventIntervalsByDay)
      .map(([firstIntervalOfDay]) => firstIntervalOfDay.start.startOf('day'));
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
          eventIntervals={eventIntervalsByDay[day.startOf('day')]}
        />
        <!-- Render other user selections -->
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