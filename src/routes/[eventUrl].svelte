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

  import JoinEventCalendarPicker from '../components/calendar/joinEvent/JoinEventCalendarPicker.svelte';

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
  console.log(event);
  let intervals = event.eventIntervals.map((interval) => ({
    start: dayjs(interval.start),
    end: dayjs(interval.end),
  }));
</script>

<div class="page">
  <h1>{event.title}</h1>
  <p>{event.description}</p>
  <JoinEventCalendarPicker eventIntervals={intervals}/>
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

  .section {
    margin: 0 0 1em;
    padding: 0.8em;
  }

  h1 {
    margin-top: 0;
  }

  span {
    display: block;
    padding-left: 5px;
  }

  .tip {
    color: var(--text-1);
    margin: 1.4em 0 1em;
    font-weight: 700;
  }

  .footer {
    color: var(--text-3);
    font-size: 0.8em;
    font-style: italic;
  }

  .button {
    width: fit-content;
    align-self: flex-end;
  }
</style>