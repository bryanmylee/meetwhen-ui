<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import { undoRedo } from '../actions/hotkeys.js';
  import undoable from '../utils/undoable.js';
  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';
  import { createNewEvent } from '../api/event.js';

  import { NewEventCalendarPicker } from '../components/calendar';
  import { Button, TextInput } from '../components/form';

  let title = '';
  let description = '';
  let username = '';
  let password = '';
  const [ selections, undo, redo, canUndo, canRedo ] = undoable([]);

  const startDate = dayjs().startOf('day');
  const daysToShow = Array.from(Array(10).keys())
      .map((inc) => startDate.add(inc, 'day'));

  function submit() {
    const eventIntervals = $selections.map((selection) => ({
      start: selection.start.utc().toISOString(),
      end: selection.end.utc().toISOString(),
    }));
    createNewEvent(title, description, username, password, eventIntervals);
  }
</script>

<svelte:window use:undoRedo={{ undo, redo }} />

<div class="page" in:fadeIn out:fadeOut>
  <h1>New Event</h1>
  <div class="card section">
    <h3>Describe your event</h3>
    <TextInput label="Title" bind:value={title} />
    <TextInput label="Description" bind:value={description} />
  </div>
  <div class="card section">
    <h3>Create an account</h3>
    <TextInput label="Username" bind:value={username} />
    <TextInput label="Password" isPassword bind:value={password} />
    <h5>Account is unique to this event only</h5>
  </div>
  <div class="picker-container card">
    <h3>Indicate event timing</h3>
    <div class="picker">
      <NewEventCalendarPicker bind:selections={$selections} {daysToShow} />
    </div>
  </div>
  <div class="button">
    <Button on:click={submit}>Create Event</Button>
  </div>
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
  }

  .section {
    padding: 0.8em;
    height: -moz-fit-content;
    height: -webkit-fit-content;
  }

  h1 {
    margin: 0 0;
  }

  .picker-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    scroll-behavior: smooth;
  }

  .picker-container > h3 {
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

  .button {
    justify-self: end;
    width: fit-content;
  }

  @media screen and (min-width: 50rem) {
    .page {
      grid-template-columns: 2fr 3fr;
      grid-template-rows: min-content;
    }

    h1 {
      grid-column: 1/-1;
    }

    .picker-container {
      grid-row: 2/6;
      grid-column: 2/3;
    }

    .button {
      grid-column: 1/2;
    }
  }
</style>