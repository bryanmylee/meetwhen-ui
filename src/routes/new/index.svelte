<script>
  import { goto, stores } from '@sapper/app';

  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';
  import { createNewEvent } from 'src/api/event';

  import EventDetailsForm from './_components/EventDetailsForm.svelte';
  import DatePickerHeader from './_components/datePicker/DatePickerHeader.svelte';
  import DatePicker from './_components/datePicker/DatePicker.svelte';
  import TimeInputBar from './_components/TimeInputBar.svelte';
  import { Button } from 'src/components/form';
  import ErrorToast from 'src/components/ErrorToast.svelte';
  import ErrorTip from 'src/components/ErrorTip.svelte';

  const { session } = stores();

  // FORM DATA
  // =========
  let title = '';
  let description = '';
  let selectedDays = [];
  let startTime = null;
  let endTime = null;

  // FORM METADATA
  // =============
  let attempted = false;
  let eventDetailsValid;
  $: datesValid = selectedDays.length !== 0;
  $: timesValid = startTime != null && endTime != null;

  // PAGE STATE
  // ==========
  let errorMessage = '';
  let isLoading = false;

  // API FUNCTIONS
  // =============
  async function handleSubmitNewEvent() {
    if (!eventDetailsValid || !datesValid || !timesValid) {
      attempted = true;
      return;
    }
    if (isLoading) {
      return;
    }
    isLoading = true;
    const schedule = selectedDays.map((day) => ({
      start: day.hour(startTime.hour()).minute(0),
      end: day.hour(endTime.hour()).minute(0),
    }));
    const eventDetails = { title, description, schedule };
    const { eventUrl } = await createNewEvent(fetch, $session.API_URL, eventDetails);
    goto(`/${eventUrl}`);
    isLoading = false;
  }
</script>

<form on:submit|preventDefault={handleSubmitNewEvent}>
  <div class="main-content grid" in:fadeIn out:fadeOut>
    <EventDetailsForm
      bind:title={title}
      bind:formValid={eventDetailsValid}
      bind:description={description}
      {attempted}
    />

    <!-- DATE AND TIME PICKER CARD -->
    <div
      class="picker-container card outline padded no-highlight"
      class:error={attempted && !(datesValid && timesValid)}
    >
      <DatePickerHeader showError={attempted && !datesValid} />
      <DatePicker bind:selectedDays={selectedDays} />
      <ErrorTip show={attempted && !datesValid}>Pick at least one date</ErrorTip>
      <TimeInputBar bind:startTime={startTime} bind:endTime={endTime} />
      <ErrorTip show={attempted && !timesValid}>Your event time cannot be empty</ErrorTip>
    </div>

    <div class="button">
      <!-- <AwaitButton onClick={handleSubmitNewEvent} type="submit">Create Event</AwaitButton> -->
      <Button type="submit" disabled={isLoading}>Create Event</Button>
    </div>

    <ErrorToast bind:errorMessage={errorMessage} />
  </div>
</form>


<style>
  .main-content {
    grid-template-rows: repeat(4, min-content);
  }

  div.picker-container {
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

    div.picker-container {
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