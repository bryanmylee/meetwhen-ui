<script>
  import { goto, stores } from '@sapper/app';
  const { session } = stores();

  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade.js';
  import { user } from 'src/stores.js';
  import { createNewEvent } from 'src/api/event.js';

  import EventDetailsForm from './_components/EventDetailsForm.svelte';
  import UserDetailsForm from './_components/UserDetailsForm.svelte';
  import DatePickerHeader from './_components/datePicker/DatePickerHeader.svelte';
  import DatePicker from './_components/datePicker/DatePicker.svelte';
  import TimeInputBar from './_components/TimeInputBar.svelte';
  import { AwaitButton } from 'src/components/form';
  import ErrorToast from 'src/components/ErrorToast.svelte';
  import ErrorTip from 'src/components/ErrorTip.svelte';

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
  let eventDetailsValid;
  let userDetailsValid;
  $: datesValid = selectedDays.length !== 0
  $: timesValid = startTime != null && endTime != null;

  // PAGE STATE
  // ==========
  let errorMessage = '';

  // API FUNCTIONS
  // =============
  async function handleSubmitNewEvent() {
    if (!eventDetailsValid || !userDetailsValid || !datesValid || !timesValid) {
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

<div class="main-content fixed-height grid" in:fadeIn out:fadeOut>
  <EventDetailsForm
    bind:title={title} bind:formValid={eventDetailsValid}
    bind:description={description}
    {attempted}
  />
  <UserDetailsForm
    bind:username={username}
    bind:password={password}
    bind:formValid={userDetailsValid}
    {attempted}
  />

  <!-- DATE AND TIME PICKER CARD -->
  <div
    class="picker-container card outline padded no-highlight"
    class:error={attempted && !(datesValid && timesValid)}
  >
    <DatePickerHeader showError={attempted && !datesValid} />
    <DatePicker bind:selectedDays={selectedDays} />
    <TimeInputBar bind:startTime={startTime} bind:endTime={endTime} />
    <ErrorTip show={attempted && !timesValid}>Your event time cannot be empty</ErrorTip>
  </div>

  <div class="button">
    <AwaitButton onClick={handleSubmitNewEvent}>Create Event</AwaitButton>
  </div>

  <ErrorToast bind:errorMessage={errorMessage} />
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
      grid-row: 1/3;
      grid-column: 2/3;
      margin-bottom: 0.5rem;
    }

    .button {
      position: unset;
      grid-row: 4/5;
      grid-column: 2/3;
      justify-self: end;
    }
  }
</style>