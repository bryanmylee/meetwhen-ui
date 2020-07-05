<svelte:options immutable={true}/>

<script>
  import { goto, stores } from '@sapper/app';
  const { session } = stores();
  import dayjs from 'dayjs';

  import { undoRedo } from 'src/actions/hotkeys.js';
  import undoable from 'src/utils/undoable.js';
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade.js';
  import { user } from 'src/stores.js';
  import { createNewEvent } from 'src/api/event.js';

  import NewCalendarPicker from './_components/calendar/NewCalendarPicker.svelte';
  import { AwaitButton, TextInput } from 'src/components/form';

  // FORM DATA
  // =========
  let title = '';
  let description = '';
  let username = '';
  let password = '';
  const selections = undoable([]);

  // FORM METADATA
  // =============
  let attempted = false;
  $: eventDetailsValid = title.trim().length !== 0;
  $: userDetailsValid = username.trim().length !== 0
        && password.trim().length !== 0;
  $: selectionsValid = $selections.length !== 0;

  // PAGE STATE
  // ==========
  let startDate = dayjs().startOf('day');
  $: daysToShow = Array.from(Array(10).keys())
      .map((inc) => startDate.add(inc, 'day'));

  // API FUNCTIONS
  // =============
  async function handleSubmitNewEvent() {
    if (!eventDetailsValid || !userDetailsValid || !selectionsValid) {
      attempted = true;
      return;
    }
    const eventDetails = ({
      title, description, username, password, schedule: $selections
    });
    const { eventUrl, accessToken }
        = await createNewEvent(fetch, $session.API_URL, eventDetails);
    user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
    goto(`/${eventUrl}`);
  }
</script>

<svelte:window use:undoRedo={{ undo: selections.undo, redo: selections.redo }} />

<div class="main-content fixed-height grid" in:fadeIn out:fadeOut>
  <!-- EVENT DETAILS FORM CARD -->
  <div
    class="card outline padded"
    class:error={attempted && !eventDetailsValid}
  >
    <h3>Describe your event</h3>
    <TextInput label="Title" bind:value={title} required {attempted} />
    <TextInput label="Description" bind:value={description} />
  </div>

  <!-- USER DETAILS FORM CARD -->
  <div
    class="card outline padded"
    class:error={attempted && !userDetailsValid}
  >
    <h3>Create an account</h3>
    <TextInput label="Username" bind:value={username} required {attempted} />
    <TextInput label="Password" bind:value={password}
      isPassword required {attempted} tip={"Account is unique to this event only"}/>
  </div>

  <!-- CALENDAR PICKER CARD -->
  <div
    class="picker-container card outline no-highlight"
    class:error={attempted && !selectionsValid}
  >
    <!-- CALENDAR PICKER CARD TITLE HEADER -->
    <h3>
      Indicate event timing
    </h3>

    <!-- CALENDAR PICKER -->
    <NewCalendarPicker bind:selections={$selections} {daysToShow} />
  </div>

  <!-- BUTTONS -->
  <div class="button">
    <AwaitButton onClick={handleSubmitNewEvent}>Create Event</AwaitButton>
  </div>
</div>

<style>
  .picker-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    scroll-behavior: smooth;
  }

  .picker-container h3 {
    padding: 0.8rem;
  }

  h3 {
    color: var(--text-1);
    margin: 0;
    font-weight: 500;
  }

  .button {
    justify-self: end;
    width: fit-content;
  }

  @media screen and (min-width: 768px) {
    .main-content {
      grid-template-columns: 2fr 3fr;
      grid-auto-flow: column;
    }

    .picker-container {
      grid-row: 1/10;
      grid-column: 2/3;
    }
  }
</style>