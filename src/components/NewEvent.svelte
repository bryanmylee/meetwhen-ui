<script>
  import { fade } from 'svelte/transition';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import CalendarPicker from './CalendarPicker.svelte';

  let title = 'test';
  let description = 'this should work...';
  let username = 'bryan';
  let password = 'bryanpassword';
  let selections = [];

  async function createNewEvent() {
    const body = ({
      username,
      password,
      title,
      description,
      eventIntervals: selections.map((selection) => ({
        start: selection.start.utc().toISOString(),
        end: selection.end.utc().toISOString(),
      })),
    });
    const response = await (await fetch('https://localhost:5000/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })).json();
    console.log(body);
    console.log(response);
  }
</script>

<div class="new-event-container" transition:fade>
  <h1>New Event</h1>
  <form>
    <label>Title</label>
    <input type="text" bind:value={title}>
    <label>Description</label>
    <input type="text" bind:value={description}>
    <label>Username</label>
    <input type="text" bind:value={username}>
    <label>Password</label>
    <input type="password" bind:value={password}>
  </form>
  <CalendarPicker bind:selections={selections}/>
  <button on:click={createNewEvent}>Create New Event</button>
</div>