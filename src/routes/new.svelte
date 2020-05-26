<svelte:options immutable={true}/>
<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);
  import hotkeys from 'hotkeys-js';

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

<div class="page" in:fadeIn out:fadeOut>
  <h1>New Event</h1>
  <div class="card section">
    <TextInput label="Title" bind:value={title} />
    <TextInput label="Description" bind:value={description} />

    <span class="tip">Create an account</span>
    <TextInput label="Username" bind:value={username} />
    <TextInput label="Password" isPassword bind:value={password} />
    <span class="footer">Account is unique to this event only</span>
  </div>
  <div class="picker card">
    <NewEventCalendarPicker bind:selections={$selections} {daysToShow} />
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

  .picker {
    overflow: scroll;
    scroll-behavior: smooth;
  }

  @media screen and (min-width: 50rem) {
    .page {
      grid-template-columns: 2fr 3fr;
      grid-template-rows: min-content;
    }

    h1 {
      grid-column: 1/-1;
    }

    .picker {
      grid-row: 2/5;
      grid-column: 2/3;
    }

    .button {
      grid-column: 1/2;
    }
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
    justify-self: end;
    width: fit-content;
  }
</style>