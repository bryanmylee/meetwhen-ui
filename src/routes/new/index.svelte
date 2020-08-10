<script>
  import { goto } from '@sapper/app';
  import dayjs from 'dayjs';

  import { currentColor } from 'src/stores';
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';
  import { createNewEvent } from 'src/api/event';

  import EventDetailsForm from './_components/EventDetailsForm.svelte';
  import ColorPicker from './_components/colorPicker/ColorPicker.svelte';
  import DatePicker from './_components/datePicker/DatePicker.svelte';
  import TimeInputBar from './_components/TimeInputBar.svelte';
  import { Button } from 'src/components/form';
  import Toast from 'src/components/ui/Toast.svelte';
  import ErrorTip from 'src/components/ui/ErrorTip.svelte';

  // FORM DATA
  // =========
  let title = '';
  let description = '';
  let selectedDays = [dayjs()];
  let startTime = dayjs().hour(9).minute(0);
  let endTime = dayjs().hour(17).minute(0);

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
    try {
      const schedule = selectedDays.map((day) => ({
        start: day.hour(startTime.hour()).minute(0),
        end: day.hour(endTime.hour()).minute(0).add(endTime.hour() === 0 ? 1 : 0, 'day'),
      }));
      const eventDetails = { title, description, color: $currentColor.hex, schedule };
      const { eventUrl } = await createNewEvent(fetch, process.env.SAPPER_APP_API_URL, eventDetails);
      goto(`/${eventUrl}`);
    } catch (err) {
      errorMessage = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="main-content grid" in:fadeIn out:fadeOut>
  <EventDetailsForm
    on:submit={handleSubmitNewEvent}
    bind:title={title}
    bind:formValid={eventDetailsValid}
    bind:description={description}
    {attempted}
  />
  <ColorPicker />

  <!-- DATE AND TIME PICKER CARD -->
  <div
    class="picker-container card outline padded no-highlight"
    class:error={attempted && !(datesValid && timesValid)}
  >
    <DatePicker bind:selectedDays={selectedDays} />
    <ErrorTip show={attempted && !datesValid}>Pick at least one date</ErrorTip>
    <TimeInputBar bind:startTime={startTime} bind:endTime={endTime} />
    <ErrorTip show={attempted && !timesValid}>Your event time cannot be empty</ErrorTip>
  </div>

  <div class="button">
    <!-- <AwaitButton onClick={handleSubmitNewEvent} type="submit">Create Event</AwaitButton> -->
    <Button on:click={handleSubmitNewEvent} disabled={isLoading}>
      Create Event
    </Button>
  </div>

  <Toast error bind:message={errorMessage} />
</div>


<style>
  .main-content {
    grid-template-rows: repeat(4, min-content);
  }

  div.picker-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    scroll-behavior: smooth;
  }

  .button {
    width: fit-content;
    justify-self: end;
  }

  @media screen and (min-width: 768px) {
    .main-content {
      grid-template-columns: 2fr 3fr;
      grid-auto-flow: column;
    }

    div.picker-container {
      grid-row: 1/3;
      grid-column: 2/3;
      margin-bottom: 0.5em;
    }

    .button {
      grid-row: 4/5;
      grid-column: 2/3;
      justify-self: end;
    }
  }
</style>