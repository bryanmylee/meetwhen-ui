<script>
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';
  import { createNewEvent } from '../api/event.js';
  import CalendarPicker from '../components/calendar/CalendarPicker.svelte';
  import MaterialTextInput from '../components/ui/MaterialTextInput.svelte';
  import MaterialButton from '../components/ui/MaterialButton.svelte';

  let title = '';
  let description = '';
  let username = '';
  let password = '';
  let selections = [];

  function submit() {
    const eventIntervals = selections.map((selection) => ({
      start: selection.start.utc().toISOString(),
      end: selection.end.utc().toISOString(),
    }));
    createNewEvent(title, description, username, password, eventIntervals);
  }
</script>

<div class="page" in:fadeIn out:fadeOut>
  <h1>New Event</h1>
  <div class="card section">
    <MaterialTextInput label="Title" bind:value={title}/>
    <MaterialTextInput label="Description" bind:value={description}/>

    <span class="tip">Sign in to edit your event when returning</span>
    <MaterialTextInput label="Username" bind:value={username}/>
    <MaterialTextInput label="Password" isPassword bind:value={password}/>
    <span class="footer">Account is unique to this event only</span>
  </div>
  <CalendarPicker bind:selections={selections}/>
  <div class="button">
    <MaterialButton label="Create Event" on:click={submit}/>
  </div>
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