<script>
  import { fade } from 'svelte/transition';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import CalendarPicker from './CalendarPicker.svelte';
  import MaterialTextInput from './MaterialTextInput.svelte';

  let title = 'Test Event';
  let description = 'A quick event to test the UI';
  let username = '';
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
    <MaterialTextInput label="Title" bind:value={title}/>
    <MaterialTextInput label="Description" bind:value={description}/>
    <MaterialTextInput label="Username" bind:value={username}/>
    <MaterialTextInput label="Password" isPassword bind:value={password}/>
  </form>
  <CalendarPicker bind:selections={selections}/>
  <button on:click={createNewEvent}>Create New Event</button>
</div>