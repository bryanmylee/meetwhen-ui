<script>
  import { fade } from 'svelte/transition';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  import CalendarPicker from './CalendarPicker.svelte';
  import MaterialTextInput from './MaterialTextInput.svelte';

  let title = '';
  let description = 'The quick brown fox';
  let username = '';
  let password = 'password';
  let selections = [];

  $: setTimeout(() => {title = 'Hello'}, 2000);

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
  <button on:click={createNewEvent}>Create New Event</button>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>