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
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);
  import hotkeys from 'hotkeys-js';

  import undoable from '../utils/undoable.js';
  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';

  import { JoinEventCalendarPicker } from '../components/calendar';
  import { Button, TextInput } from '../components/form';

  export let event;

  let isJoining = false;
  let username = '';
  let password = '';
  const [ selections, undo, redo, canUndo, canRedo ] = undoable([]);

  function submit() {
    const eventintervals = $selections.map((selection) => ({
      start: selection.start.utc().toISOString(),
      end: selection.end.utc().toISOString(),
    }));
  }

  function handleButtonClick() {
    if (isJoining) {
      submit();
    } else {
      isJoining = true;
    }
  }

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
  <div id="details">
    <h1>{event.title}</h1>
    <p>{event.description}</p>
  </div>
  {#if isJoining}
    <h2 in:slide={{duration: 500, easing: cubicOut}}>
      Indicate your availability
    </h2>
  {/if}
  <div class="picker card">
    <JoinEventCalendarPicker bind:selections={$selections}
      eventIntervals={event.eventIntervals} 
      userIntervalsByUsername={event.userIntervalsByUsername}
      isCollapsed={isJoining}
    />
  </div>
  {#if isJoining}
    <div class="card section" in:slide={{duration: 500, easing: cubicOut}}>
      <span class="tip">Create an account</span>
      <TextInput label="Username" bind:value={username} />
      <TextInput label="Password" isPassword bind:value={password} />
      <span class="footer">Account is unique to this event only</span>
    </div>
  {/if}
  <div class="button">
    <Button on:click={handleButtonClick}>Join Event</Button>
  </div>
</div>

<style>
  .page {
    /* Allows the calendar to dynamically resize */
    display: grid;
    gap: 1rem;
    height: 100vh;
    padding: 1em;
    box-sizing: border-box;
  }

  .section {
    padding: 0.8em;
  }

  h1 {
    margin-top: 0;
  }

  .picker {
    overflow: scroll;
    scroll-behavior: smooth;
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
    justify-self: end;
  }
</style>