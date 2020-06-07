<svelte:options immutable={true}/>

<script>
  import { goto, stores } from '@sapper/app';
  const { session } = stores();
  import dayjs from 'dayjs';

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
  let attempted = false;
  $: eventDetailsValid = title.trim().length !== 0;
  $: userDetailsValid = username.trim().length !== 0
        && password.trim().length !== 0;
  $: selectionsValid = $selections.length !== 0;

  const startDate = dayjs().startOf('day');
  const daysToShow = Array.from(Array(10).keys())
      .map((inc) => startDate.add(inc, 'day'));

  async function submit() {
    if (!eventDetailsValid || !userDetailsValid || !selectionsValid) {
      attempted = true;
      return;
    }
    const eventDetails = ({
      title, description, username, password, eventIntervals: $selections
    });
    const { eventUrl, accessToken, accessTokenLifetime }
        = await createNewEvent(fetch, $session.API_URL, eventDetails);
    goto(`/${eventUrl}`);
  }
</script>

<svelte:window use:undoRedo={{ undo, redo }} />

<div class="page" in:fadeIn out:fadeOut>
  <h1>New Event</h1>
  <div
    class="card__outline section"
    class:error={attempted && !eventDetailsValid}
  >
    <h3>Describe your event</h3>
    <TextInput label="Title" bind:value={title} required {attempted} />
    <TextInput label="Description" bind:value={description} />
  </div>
  <div
    class="card__outline section"
    class:error={attempted && !userDetailsValid}
  >
    <h3>Create an account</h3>
    <TextInput label="Username" bind:value={username} required {attempted} />
    <TextInput label="Password" bind:value={password} isPassword required {attempted} />
    <h5>Account is unique to this event only</h5>
  </div>
  <div
    class="picker-container card__outline no-highlight"
    class:error={attempted && !selectionsValid}
  >
    <h3>
      Indicate event timing
    </h3>
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
    background-color: var(--background-1);
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
    font-weight: 500;
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