<script context="module">
  import { getEvent } from 'src/api/event.js';
  import { login, logout, getAccessToken } from 'src/api/authentication.js';

  export async function preload(page, session) {
    const { eventUrl } = page.params;
    // Check for refresh token by getting access token.
    try {
      const { accessToken } = await getAccessToken(
          this.fetch, session.API_URL, eventUrl);
      return ({
        event: await getEvent(this.fetch, session.API_URL, eventUrl),
        accessToken,
      });
    } catch (err) {
      // Refresh token not found.
      console.log(err.message);
      return ({
        event: await getEvent(this.fetch, session.API_URL, eventUrl),
      });
    }
  }
</script>

<script>
  import { stores } from '@sapper/app';
  const { session } = stores();
  import { fade, slide } from 'svelte/transition';
  import dayjs from 'dayjs';

  import { user } from 'src/stores.js';
  import {
    layoutEnum, detailsEnum, formEnum,
    layout, details, form, selectedUsernames,
  } from './stores.js';
  import { undoRedo } from 'src/actions/hotkeys.js';
  import mediaQuery from 'src/actions/mediaQuery.js';
  import undoable from 'src/utils/undoable.js';
  import nextFrame from 'src/utils/nextFrame.js';
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade.js';
  import { addUserToEvent } from 'src/api/event.js';

  import Details from './_components/Details.svelte';
  import UserDetailsForm from './_components/UserDetailsForm.svelte';
  import ActionBar from './_components/ActionBar.svelte';
  import CalendarPicker from './_components/calendar/CalendarPicker.svelte';
  import { Button, TextInput } from 'src/components/form';
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
  $: userDetailsValid = username.trim().length !== 0
      && password.trim().length !== 0;
  $: selectionsValid = $selections.length !== 0;

  // PAGE STATE
  // ==========
  let errorMessage = '';
  $: $form, resetForm();

  // PAGE FUNCTIONS
  // ==============
  async function refreshDataOnSuccess() {
    event = await getEvent(fetch, $session.API_URL, event.eventUrl, fetch);
    await nextFrame();
    $form = formEnum.NONE;
  }

  function resetForm() {
    errorMessage = '';
    username = '';
    password = '';
    $selections = [];
    selections.clearStack();
    attempted = false;
  }

  // API FUNCTIONS
  // =============
  async function handleSubmitNewUser() {
    if (!userDetailsValid || !selectionsValid) {
      attempted = true;
      return;
    }
    const userDetails = { username, password, intervals: $selections };
    try {
      const { accessToken } = await addUserToEvent(
          fetch, $session.API_URL, event.eventUrl, userDetails);
      user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
      refreshDataOnSuccess();
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
          fetch, $session.API_URL, event.eventUrl, userDetails);
      user.setAccessToken(accessToken, $session.ACCESS_TOKEN_SECRET);
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }

  async function handleLogout() {
    try {
      const { message } = await logout(fetch, $session.API_URL, event.eventUrl);
      user.logout();
    } catch (err) {
      errorMessage = err.message;
    }
  }
</script>

<svelte:window
  use:undoRedo={{undo: selections.undo, redo: selections.redo}}
  use:mediaQuery={{
    query: "(min-width: 768px)",
    callback: (matches) => $layout = matches ? layoutEnum.WIDE : layoutEnum.NARROW,
  }}
/>

<div class="main-content fixed-height grid" in:fadeIn out:fadeOut>
  <!-- DETAILS CARD WITH PAGING FOR NARROW LAYOUT -->
  <Details {event} />

  <!-- USER DETAILS FORM CARD -->
  {#if $form === formEnum.LOGGING_IN}
    <UserDetailsForm
      bind:username={username}
      bind:password={password}
      prompt={'Log in'}
      {attempted}
    />
  {:else if $form === formEnum.JOINING}
    <UserDetailsForm
      bind:username={username}
      bind:password={password}
      prompt={'Create an account'}
      tip={'Account is unique to this event only'}
      {attempted}
    />
  {/if}

  <!-- CALENDAR PICKER CARD -->
  <div
    class="picker-container card outline"
    class:error={$form === formEnum.JOINING && attempted && !selectionsValid}
  >
    <!-- CALENDAR PICKER CARD TITLE HEADER -->
    {#if $form === formEnum.JOINING}
    <!-- Wrap the slide transition within an extra div to prevent jitter issue
    on Chrome and Firefox -->
      <div>
        <h3 transition:slide={{duration: 300}}>
          Indicate your availability
        </h3>
      </div>
    {/if}

    <!-- CALENDAR PICKER -->
    <CalendarPicker bind:selections={$selections}
      eventIntervals={event.eventIntervals}
      userIntervalsByUsername={event.userIntervalsByUsername}
      isCollapsed={$form === formEnum.JOINING}
    />
  </div>

  <!-- BOTTOM ACTION BAR -->
  <ActionBar
    {handleSubmitLogin}
    {handleLogout}
    {handleSubmitNewUser}
  />

  <ErrorToast bind:errorMessage={errorMessage} />
</div>

<style>
  .picker-container {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .picker-container div h3 {
    color: var(--text-1);
    margin: 0;
    padding: 0.8rem;
    font-weight: 700;
  }

  @media screen and (min-width: 768px) {
    .main-content {
      grid-template-columns: 2fr 3fr;
      grid-auto-flow: column;
    }

    .picker-container {
      grid-row: 1/6;
      grid-column: 2/3;
    }
  }
</style>