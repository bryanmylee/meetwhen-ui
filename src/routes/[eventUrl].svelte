<svelte:options immutable={true}/>
<script context="module">
  import { getEvent } from '../api/event.js';

  export async function preload(page, session) {
    const { eventUrl } = page.params;
    return getEvent(this, eventUrl);
  }
</script>

<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import hotkeys from 'hotkeys-js';

  import undoable from '../utils/undoable.js';
  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';

  import { JoinEventCalendarPicker } from '../components/calendar';

  export let event;
  
  const [ selections, undo, redo, canUndo, canRedo ] = undoable([]);

  // Keyboard event listeners
  onMount(() => {
    hotkeys('ctrl+z, command+z', (event) => {
      event.preventDefault();
      undo();
    });

    hotkeys('shift+ctrl+z, shift+command+z', (event) => {
      event.preventDefault();
      redo();
    });
  })
</script>

<div class="page">
  <h1>{event.title}</h1>
  <p>{event.description}</p>
  <JoinEventCalendarPicker bind:selections={$selections}
    eventIntervals={event.eventIntervals} 
    userIntervalsByUsername={event.userIntervalsByUsername}
  />
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