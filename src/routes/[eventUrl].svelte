<svelte:options immutable={true}/>
<script context="module">
  import { getEvent } from '../api/event.js';

  export async function preload(page, session) {
    const { eventUrl } = page.params;
    return getEvent(this, eventUrl);
  }
</script>

<script>
  import { fade, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import { undoRedo } from '../actions/hotkeys.js';
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
</script>

<svelte:window use:undoRedo={{ undo, redo }} />

<div class="page" in:fadeIn out:fadeOut>
  <div class="card__outline section">
    <h1>{event.title}</h1>
    <p>{event.description}</p>
  </div>
  {#if isJoining}
    <div class="card__outline section" in:slide={{duration: 500, easing: cubicOut}}>
      <!-- Content of div with slide transitions is not masked properly on
      Safari. Therefore, implement a nice fade in after div is fully sized. -->
      <div in:fade={{duration: 150, delay: 500}}>
        <h3>Create an account</h3>
        <TextInput label="Username" bind:value={username} />
        <TextInput label="Password" isPassword bind:value={password} />
        <h5>Account is unique to this event only</h5>
      </div>
    </div>
  {/if}
  <div class="picker-container card__outline">
    {#if isJoining}
    <!-- Wrap the slide transition within an extra div to prevent jitter issue
    on Chrome and Firefox -->
      <div>
        <h3 in:slide={{duration: 500, easing: cubicOut}}>
          Indicate your availability
        </h3>
      </div>
    {/if}
    <div class="picker">
      <JoinEventCalendarPicker bind:selections={$selections}
        eventIntervals={event.eventIntervals} 
        userIntervalsByUsername={event.userIntervalsByUsername}
        isCollapsed={isJoining}
      />
    </div>
  </div>
  {#if isJoining}
    <div class="confirm">
      <Button on:click={submit}>Confirm</Button>
    </div>
  {:else}
    <div class="join">
      <Button on:click={() => isJoining = true}>Join Event</Button>
    </div>
  {/if}
</div>

<style>
  .page {
    /* Allows the calendar to dynamically resize */
    display: grid;
    gap: 1rem;
    width: 100%;
    height: 100vh;
    padding: 1em;
    box-sizing: border-box;
    background-color: var(--background-1);
  }

  h1 {
    margin: 0 0 0.5em;
  }

  p {
    margin: 0;
  }

  .picker-container {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .picker-container > div > h3 {
    padding: 0.8rem;
    padding-left: calc(0.8rem + 5px);
  }

  .picker {
    overflow: scroll;
    scroll-behavior: smooth;
  }

  h3 {
    color: var(--text-1);
    margin: 0;
    padding: 0 5px 5px;
    font-weight: 700;
  }

  h5 {
    color: var(--text-3);
    padding-left: 5px;
    margin: 0;
    font-size: 0.8em;
    font-style: italic;
    font-weight: 400;
  }

  .join {
    min-width: -moz-max-content;
    min-width: -webkit-max-content;
    justify-self: end;
  }

  .confirm {
    width: fit-content;
    justify-self: end;
  }

  @media screen and (min-width: 50rem) {
    .page {
      grid-template-columns: 2fr 3fr;
      grid-auto-flow: column;
    }

    .picker-container {
      grid-row: 1/6;
      grid-column: 2/3;
    }
  }
</style>