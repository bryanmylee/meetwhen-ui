<script>
  import { fade } from 'svelte/transition';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import { createNewEvent } from '../api/event.js';
  import CalendarPicker from './CalendarPicker.svelte';
  import MaterialTextInput from './ui/MaterialTextInput.svelte';

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

<div id="new-event-container" transition:fade>
  <form>
    <MaterialTextInput
      label="Title" bind:value={title}
      fontSize='2rem' fontWeight='700'
    />
    <MaterialTextInput label="Description" bind:value={description}/>
    <MaterialTextInput label="Username" bind:value={username}/>
    <MaterialTextInput label="Password" isPassword bind:value={password}/>
  </form>
  <CalendarPicker bind:selections={selections}/>
  <button on:click={submit}>Create New Event</button>
</div>

<style>
  #new-event-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column; /* Allows the calendar to dynamically resize */
  }

  button {
    min-height: 2em;
  }
</style>