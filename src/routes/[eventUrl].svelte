<script context="module">
  import { getEvent } from '../api/event.js';
  console.log('loading module...');
  export async function preload(page, session) {
    console.log('preloading...')
    const { eventUrl } = page.params;
    return getEvent(this, eventUrl);
  }
</script>

<script>
  import dayjs from 'dayjs';

  /*
   * event: {
   *   id: number,
   *   eventUrl: string,
   *   title: string,
   *   description: string,
   *   dateCreated: string,
   *   eventIntervals: {start: string, end: string}[],
   *   userIntervalsByUsername: {
   *     [username: string]: {start: string, end: string}[],
   *   },
   * }
   */
  export let event;
  let selections = event.eventIntervals.map((interval) => {
    return ({
      // Formats the ISO string to local time.
      start: dayjs(interval.start),
      end: dayjs(interval.end),
    });
  })
</script>

<div class="page">
  <h1>{event.title}</h1>
  <p>{event.description}</p>
</div>