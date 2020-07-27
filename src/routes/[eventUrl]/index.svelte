<script context="module">
  import { currentColor } from 'src/stores';
  import { getEvent } from 'src/api/event';
  import { login, logout, getAccessToken } from 'src/api/authentication';

  export async function preload(page, session) {
    const { eventUrl } = page.params;
    const event = await getEvent(this.fetch, session.API_URL, eventUrl);
    if (event.color) {
      currentColor.setBaseColorHex(event.color);
    }
    let accessToken = null;
    // Check for refresh token on browser by getting access token.
    if (process.browser) {
      try {
        accessToken = (await getAccessToken(this.fetch, session.API_URL, eventUrl)).accessToken;
      } catch (err) {
        // Refresh token not found.
        // console.log(err.message);
      }
    }
    return { event, accessToken };
  }
</script>

<script>
  import { stores } from '@sapper/app';

  import { user } from 'src/stores';
  import { formEnum, form } from './stores';
  import { undoRedo } from 'src/actions/hotkeys';
  import undoable from 'src/utils/undoable';
  import nextFrame from 'src/utils/nextFrame';
  import { splitIntervalsOnMidnight } from 'src/utils/interval';
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';
  import { addUserToEvent, editUserIntervals } from 'src/api/event';

  import CompositeDetails from './_components/CompositeDetails.svelte';
  import UserDetailsForm from './_components/UserDetailsForm.svelte';
  import ActionBar from './_components/ActionBar.svelte';
  import CalendarHeader from './_components/calendar/CalendarHeader.svelte';
  import EventCalendarPicker from './_components/calendar/EventCalendarPicker.svelte';
  import ErrorToast from 'src/components/ErrorToast.svelte';

  const { session } = stores();

  // PRELOADED DATA
  // ==============
  export let event;
  export let accessToken;
  user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);

  // FORM DATA
  // =========
  let username = '';
  let password = '';
  const selections = undoable([]);

  // FORM METADATA
  // =============
  let attempted = false;
  let userDetailsValid;
  $: scheduleValid = $selections.length !== 0;
  $: showCalendarError = attempted
      && ($form === formEnum.EDITING || $form === formEnum.JOINING)
      && !scheduleValid;

  // PAGE STATE
  // ==========
  let errorMessage = '';
  $: if ($form) setForm();
  let isLoading = false;

  // PAGE FUNCTIONS
  // ==============
  async function refreshDataOnSuccess() {
    event = await getEvent(fetch, $session.API_URL, event.eventUrl, fetch);
    await nextFrame();
    $form = formEnum.NONE;
  }

  function setForm() {
    if ($form === formEnum.EDITING) {
      $selections = splitIntervalsOnMidnight(event.userSchedules[$user.username]);
    } else {
      $selections = [];
    }
    selections.clearStack();
    errorMessage = '';
    username = '';
    password = '';
    attempted = false;
  }

  // API FUNCTIONS
  // =============
  async function handleSubmit() {
    if (isLoading) {
      return;
    }
    isLoading = true;
    if ($form === formEnum.EDITING) {
      await handleSubmitEditUser();
    } else if ($form === formEnum.JOINING) {
      await handleSubmitNewUser();
    } else if ($form === formEnum.LOGGING_IN) {
      await handleSubmitLogin();
    }
    isLoading = false;
  }

  async function handleLogout() {
    try {
      await logout(fetch, $session.API_URL, event.eventUrl);
      user.logout();
    } catch (err) {
      errorMessage = err.message;
    }
  }

  async function handleSubmitLogin() {
    if (!userDetailsValid) {
      attempted = true;
      return;
    }
    const userDetails = { username, password };
    try {
      accessToken = (await login(fetch, $session.API_URL, event.eventUrl, userDetails)).accessToken;
      user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }

  async function handleSubmitNewUser() {
    if (!userDetailsValid || !scheduleValid) {
      attempted = true;
      return;
    }
    const userDetails = { username, password, schedule: $selections };
    try {
      accessToken = (await addUserToEvent(
        fetch, $session.API_URL, event.eventUrl, userDetails,
      )).accessToken;
      user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }

  async function handleSubmitEditUser() {
    if (!scheduleValid) {
      attempted = true;
      return;
    }
    const userDetails = {
      username: $user.username,
      newSchedule: $selections,
      accessToken: $user.accessToken,
    };
    try {
      await editUserIntervals(fetch, $session.API_URL, event.eventUrl, userDetails);
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }
</script>

<svelte:window use:undoRedo={{ undo: selections.undo, redo: selections.redo }} />

<div class="main-content fixed-height grid" in:fadeIn out:fadeOut>
  <!-- DETAILS CARD WITH PAGING FOR NARROW LAYOUT -->
  <CompositeDetails {event} />

  {#if $form === formEnum.LOGGING_IN || $form === formEnum.JOINING}
    <UserDetailsForm
      on:submit={handleSubmit}
      bind:username={username}
      bind:password={password}
      bind:formValid={userDetailsValid}
      {attempted}
    />
  {/if}

  <!-- CALENDAR PICKER CARD -->
  <div
    class="picker-container card outline"
    class:error={showCalendarError}
  >
    <CalendarHeader showError={showCalendarError} />
    <EventCalendarPicker bind:selections={$selections}
      eventIntervals={event.schedule}
      userIntervalsByUsername={event.userSchedules}
    />
  </div>

  <!-- BOTTOM ACTION BAR -->
  <ActionBar
    on:submit={handleSubmit}
    on:logout={handleLogout}
    disabled={isLoading}
  />

  <ErrorToast bind:errorMessage={errorMessage} />
</div>

<style>
  .picker-container {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 4.5rem !important;
  }

  @media screen and (min-width: 768px) {
    .main-content {
      grid-template-columns: 2fr 3fr;
      grid-auto-flow: column;
    }

    .picker-container {
      grid-row: 1/10;
      grid-column: 2/3;
      margin-bottom: unset !important;
    }
  }
</style>