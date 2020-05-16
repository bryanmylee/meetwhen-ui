<script context="module">
  import { getEvent } from '../api/event.js';
  export async function preload(page, session) {
    const { eventUrl } = page.params;
    return getEvent(this, eventUrl);
  }
</script>

<script>
  import dayjs from 'dayjs';

  import { createHistory } from '../utils/history.js';
  const history = createHistory({ selections: [] });
  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';
  import JoinEventCalendarPicker from '../components/calendar/joinEvent/JoinEventCalendarPicker.svelte';

  export let event;
  /*
   * It is possible that the event intervals span multiple days due to different
   * timezones. Split those intervals across the midnight boundary.
   */
  const splitIntervals = event.eventIntervals.flatMap((interval, index) => {
    const { start, end } = interval;
    if (start.date() !== end.date()) {
      return [
        { start, end: end.startOf('day') },
        { start: end.startOf('day'), end },
      ];
    }
    return [ interval ];
  });
</script>

<div class="page">
  <h1>{event.title}</h1>
  <p>{event.description}</p>
  <JoinEventCalendarPicker eventIntervals={splitIntervals} {history} />
</div>

<style>
  .page {
    /* Allows the calendar to dynamically resize */
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 1em;
    box-sizing: border-box;
  }

  h1 {
    margin-top: 0;
  }
</style>