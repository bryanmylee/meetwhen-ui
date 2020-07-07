<svelte:options immutable={true}/>

<script>
  import { goto, stores } from '@sapper/app';
  const { session } = stores();
  import dayjs from 'dayjs';

  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade.js';
  import { user } from 'src/stores.js';
  import { createNewEvent } from 'src/api/event.js';

  import DatePicker from './_components/datePicker/DatePicker.svelte';
  import { AwaitButton, TextInput, TimeInput } from 'src/components/form';

  // FORM DATA
  // =========
  let title = '';
  let description = '';
  let username = '';
  let password = '';
  let selectedDays = [];
  let startTime = null;
  let endTime = null;

  // FORM METADATA
  // =============
  let attempted = false;
  $: eventDetailsValid = title.trim().length !== 0;
  $: userDetailsValid = username.trim().length !== 0
        && password.trim().length !== 0;
  $: timeValid = selectedDays.length !== 0
        && startTime != null && endTime != null;

  // API FUNCTIONS
  // =============
  async function handleSubmitNewEvent() {
    if (!eventDetailsValid || !userDetailsValid || !timeValid) {
      attempted = true;
      return;
    }
    const schedule = selectedDays.map(day => ({
      start: day.hour(startTime.hour()).minute(0),
      end: day.hour(endTime.hour()).minute(0),
    }))
    const eventDetails = ({
      title, description, username, password, schedule,
    });
    const { eventUrl, accessToken }
        = await createNewEvent(fetch, $session.API_URL, eventDetails);
    user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
    goto(`/${eventUrl}`);
  }
</script>

<div class="main-content grid" in:fadeIn out:fadeOut>
  <!-- EVENT DETAILS FORM CARD -->
  <div
    class="card outline padded"
    class:error={attempted && !eventDetailsValid}
  >
    <h3>Describe your event</h3>
    <TextInput label="Title" bind:value={title}
      required {attempted}
      style="margin-top: 1rem" />
    <TextInput label="Description" bind:value={description}
      style="margin-top: 1rem" />
  </div>

  <!-- USER DETAILS FORM CARD -->
  <div
    class="card outline padded"
    class:error={attempted && !userDetailsValid}
  >
    <h3>Create an account</h3>
    <TextInput label="Username" bind:value={username}
      required {attempted}
      style="margin-top: 1rem" />
    <TextInput label="Password" bind:value={password}
      isPassword required {attempted} tip="Account is unique to this event only"
      style="margin-top: 1rem" />
  </div>

  <!-- DATE AND TIME PICKER CARD -->
  <div
    class="picker-container card outline no-highlight"
    class:error={attempted && !timeValid}
  >
    <!-- DATE AND TIME PICKER CARD TITLE HEADER -->
    <h3>
      Indicate event timing
    </h3>

    <!-- DATE AND TIME PICKER -->
    <DatePicker bind:selectedDays={selectedDays} />
    <div class="timebar">
      <TimeInput
        bind:selectedTime={startTime}
        label="From"
        style="margin-right: 1rem"
        latestTime={dayjs().hour(23).minute(0)}
      />
      <TimeInput
        bind:selectedTime={endTime}
        label="To"
        earliestTime={startTime && startTime.add(1, 'hour')}
      />
    </div>
    <!-- <NewCalendarPicker bind:selections={$selections} {daysToShow} /> -->
  </div>

  <!-- BUTTONS -->
  <div class="button">
    <AwaitButton onClick={handleSubmitNewEvent}>Create Event</AwaitButton>
  </div>
</div>

<style>
  .main-content {
    grid-template-rows: repeat(4, min-content);
  }

  .picker-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    scroll-behavior: smooth;
    margin-bottom: 4rem;
  }

  .picker-container > h3 {
    padding: 0.8rem;
  }

  h3 {
    color: var(--text-1);
    margin: 0;
    font-weight: 500;
  }

  .timebar {
    padding: 1rem;
    display: flex;
    flex-flow: row nowrap;
  }

  .button {
    position: fixed;
    right: 0.5rem;
    bottom: 0.5rem;
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