<script context="module">
  import { getEvent } from 'src/api/event.js';
  import { login, logout, getAccessToken } from 'src/api/authentication.js';

  export async function preload(page, session) {
    const { eventUrl } = page.params;
    try {
      const event = await getEvent(this.fetch, session.API_URL, eventUrl);
      let accessToken = null;
      // Check for refresh token on browser by getting access token.
      if (process.browser) {
        try {
          accessToken = (await getAccessToken(
              this.fetch, session.API_URL, eventUrl)).accessToken;
        } catch (err) {
          // Refresh token not found.
          console.log(err.message);
        }
      }
      return ({ event, accessToken });
    } catch (err) {
      console.log(err.message);
    }
  }
</script>

<script>
  import { stores } from '@sapper/app';
  const { session } = stores();

  import { user } from 'src/stores.js';
  import { formEnum, form } from './stores.js';
  import { undoRedo } from 'src/actions/hotkeys.js';
  import undoable from 'src/utils/undoable.js';
  import nextFrame from 'src/utils/nextFrame.js';
  import { splitIntervalsOnMidnight } from 'src/utils/interval.js';
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade.js';
  import { addUserToEvent, editUserIntervals } from 'src/api/event.js';
  import { validateNewUsername, validateNewPassword,
      validateUsername, validatePassword } from 'src/utils/validation';

  import CompositeDetails from './_components/CompositeDetails.svelte';
  import UserDetailsForm from './_components/UserDetailsForm.svelte';
  import ActionBar from './_components/ActionBar.svelte';
  import CalendarHeader from './_components/calendar/CalendarHeader.svelte';
  import EventCalendarPicker from './_components/calendar/EventCalendarPicker.svelte';
  import ErrorToast from 'src/components/ErrorToast.svelte';

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
  $: $form, setForm();

  // PAGE FUNCTIONS
  // ==============
  async function refreshDataOnSuccess() {
    event = await getEvent(fetch, $session.API_URL, event.eventUrl, fetch);
    await nextFrame();
    $form = formEnum.NONE;
  }

  function setForm() {
    if ($form === formEnum.EDITING) {
      $selections = splitIntervalsOnMidnight(
          event.userSchedules[$user.username]);
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
  async function handleSubmitLogin() {
    if (!userDetailsValid) {
      attempted = true;
      return;
    }
    const userDetails = { username, password };
    try {
      const { accessToken } = await login(
          fetch, $session.API_URL, event.eventUrl, userDetails);
      user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }

  async function handleLogout() {
    try {
      await logout(fetch, $session.API_URL, event.eventUrl);
      user.logout();
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
      const { accessToken } = await addUserToEvent(
          fetch, $session.API_URL, event.eventUrl, userDetails);
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
    const userDetails = ({
      username: $user.username,
      newSchedule: $selections,
      accessToken: $user.accessToken
    });
    try {
      await editUserIntervals(
          fetch, $session.API_URL, event.eventUrl, userDetails);
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }
</script>

<svelte:window use:undoRedo={{undo: selections.undo, redo: selections.redo}} />

<div class="main-content fixed-height grid" in:fadeIn out:fadeOut>
  <!-- DETAILS CARD WITH PAGING FOR NARROW LAYOUT -->
  <CompositeDetails {event} />

  {#if $form === formEnum.LOGGING_IN}
    <UserDetailsForm
      bind:username={username}
      bind:password={password}
      bind:formValid={userDetailsValid}
      usernameValidation={validateUsername}
      passwordValidation={validatePassword}
      prompt="Welcome back!"
      {attempted}
    />
  {:else if $form === formEnum.JOINING}
    <UserDetailsForm
      bind:username={username}
      bind:password={password}
      bind:formValid={userDetailsValid}
      usernameValidation={validateNewUsername}
      passwordValidation={validateNewPassword}
      prompt="Who are you?"
      tip="Account is unique to this event only"
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
    {handleSubmitLogin}
    {handleLogout}
    {handleSubmitNewUser}
    {handleSubmitEditUser}
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