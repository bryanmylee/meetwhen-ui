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
</script>

{JSON.stringify(event)}