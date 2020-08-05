<script context="module">
  import { currentColor, user } from 'src/stores';
  import { getEvent } from 'src/api/event';
  import { login, logout } from 'src/api/authentication';

  export async function preload(page) {
    const { eventUrl } = page.params;
    let event;

    try {
      event = await getEvent(this.fetch, process.env.SAPPER_APP_API_URL, eventUrl);
    } catch (err) {
      this.redirect(302, `${eventUrl}/404`);
    }

    if (event.color) {
      currentColor.setBaseColorHex(event.color);
    }
    if (event.accessToken) {
      user.setAccessToken(event.accessToken, process.env.SAPPER_APP_ACCESS_TOKEN_SECRET);
    }
    return { event };
  }
</script>

<script>
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
  import CalendarPicker from './_components/calendar/CalendarPicker.svelte';
  import Toast from 'src/components/ui/Toast.svelte';

  // PRELOADED DATA
  // ==============
  export let event;

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
  let disableConfirm = false;
  $: {
    if ($form === formEnum.EDITING) {
      disableConfirm = !scheduleValid;
    } else if ($form === formEnum.JOINING) {
      disableConfirm = !userDetailsValid || !scheduleValid;
    } else if ($form === formEnum.LOGGING_IN) {
      disableConfirm = !userDetailsValid;
    }
  }

  // PAGE STATE
  // ==========
  let message = '';
  let errorMessage = '';
  $: if ($form) setForm();
  let isLoading = false;
  let userFormCollapsed = false;

  // PAGE FUNCTIONS
  // ==============
  async function refreshDataOnSuccess() {
    event = await getEvent(fetch, process.env.SAPPER_APP_API_URL, event.eventUrl, fetch);
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
    userFormCollapsed = false;
  }

  function showLongTouchHint() {
    message = 'Long touch and drag to make a selection!';
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
      await logout(fetch, process.env.SAPPER_APP_API_URL, event.eventUrl);
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
      const { accessToken } = await login(
        fetch,
        process.env.SAPPER_APP_API_URL,
        event.eventUrl,
        userDetails,
      );
      user.setAccessToken(accessToken, process.env.SAPPER_APP_ACCESS_TOKEN_SECRET);
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
      const { accessToken } = await addUserToEvent(
        fetch, process.env.SAPPER_APP_API_URL, event.eventUrl, userDetails,
      );
      user.setAccessToken(accessToken, process.env.SAPPER_APP_ACCESS_TOKEN_SECRET);
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
      await editUserIntervals(fetch, process.env.SAPPER_APP_API_URL, event.eventUrl, userDetails);
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
      bind:username
      bind:password
      bind:formValid={userDetailsValid}
      bind:collapsed={userFormCollapsed}
      {attempted}
    />
  {/if}

  <!-- CALENDAR PICKER CARD -->
  <div
    class="picker-container card outline"
    class:error={showCalendarError}
    on:click={() => userFormCollapsed = true}
    on:touchstart={(e) => {
      if (!userFormCollapsed) {
        e.preventDefault();
        e.stopPropagation();
      }
      userFormCollapsed = true;
    }}
  >
    <CalendarHeader showError={showCalendarError} />
    <CalendarPicker
      bind:selections={$selections}
      schedule={event.schedule}
      userSchedules={event.userSchedules}
    />
  </div>

  <!-- BOTTOM ACTION BAR -->
  <ActionBar
    on:submit={handleSubmit}
    on:logout={handleLogout}
    disabled={isLoading}
    fakeDisabled={disableConfirm}
  />
</div>
  <Toast bind:message={message} />
  <Toast error bind:message={errorMessage} />

<style>
  .picker-container {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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