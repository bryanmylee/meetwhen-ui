<svelte:head>
  <title>meetwhen - New Event</title>
</svelte:head>

<script>
  import { goto } from '@sapper/app';
  import dayjs from 'dayjs';

  import { currentColor } from 'src/stores';
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';
  import { createNewEvent } from 'src/api/event';
  import { getLowRes } from 'src/utils/selection';

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
        start: day.hour(startTime.hour()).minute(0).second(0).millisecond(0),
        end: day.hour(endTime.hour()).minute(0).second(0).millisecond(0)
          .add(endTime.hour() === 0 ? 1 : 0, 'day'),
      }));
      const scheduleLowRes = getLowRes(schedule);
      const eventDetails = { title, description, color: $currentColor.hex, schedule: scheduleLowRes };
      const { eventUrl } = await createNewEvent(fetch, process.env.SAPPER_APP_API_URL, eventDetails);
      goto(`/${eventUrl}`);
    } catch (err) {
      errorMessage = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="main-content" in:fadeIn out:fadeOut>
  <div class="left-column">
    <EventDetailsForm
      on:submit={handleSubmitNewEvent}
      bind:title={title}
      bind:formValid={eventDetailsValid}
      bind:description={description}
      {attempted}
    />
    <ColorPicker />
  </div>

  <div class="right-column">
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
      <Button on:click={handleSubmitNewEvent} disabled={isLoading}>
        Create Event
      </Button>
    </div>
  </div>
</div>

<Toast error bind:message={errorMessage} />


<style>
  .main-content {
    display: flex;
    flex-direction: column;
    padding: 0.4em;
  }

  .left-column, .right-column {
    display: flex;
    flex-direction: column;
  }

  :global(.left-column > div),
  :global(.right-column > div) {
    margin: 0.4em;
  }

  .picker-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    scroll-behavior: smooth;
  }

  .button {
    width: fit-content;
    align-self: flex-end;
  }

  @media screen and (min-width: 768px) {
    .main-content {
      display: grid;
      grid-template-columns: 2fr 3fr;
    }
  }
</style>