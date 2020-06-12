<script context="module">
  import { getEvent } from '@/api/event.js';
  import { login, getAccessToken } from '@/api/authentication.js';

  export async function preload(page, session) {
    const { eventUrl } = page.params;
    // Check for refresh token by getting access token.
    let accessToken = null;
    try {
      accessToken = (await getAccessToken(
          this.fetch, session.API_URL, eventUrl)).accessToken;
    } catch (err) {
      // Refresh token not found.
      console.log(err.message);
    }
    return ({
      event: await getEvent(this.fetch, session.API_URL, eventUrl),
      accessToken,
    });
  }
</script>

<script>
  import { stores } from '@sapper/app';
  const { session } = stores();
  import { fade, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';

  import { NONE, LOGGING_IN, JOINING } from './_pageStates.js';
  import { user } from '@/stores.js';
  import { undoRedo } from '@/actions/hotkeys.js';
  import mediaQuery from '@/actions/mediaQuery.js';
  import undoable from '@/utils/undoable.js';
  import nextFrame from '@/utils/nextFrame.js';
  import { fadeIn, fadeOut } from '@/utils/pageCrossfade.js';
  import { addUserToEvent } from '@/api/event.js';

  import TitleCard from './_TitleCard.svelte';
  import LoginForm from './_LoginForm.svelte';
  import JoinForm from './_JoinForm.svelte';
  import ActionBar from './_ActionBar.svelte';
  import { JoinEventCalendarPicker } from '@/components/calendar';
  import { Button, TextInput } from '@/components/form';
  import ErrorToast from '@/components/ErrorToast.svelte';

  // PRELOADED DATA
  // ==============
  export let event;
  export let accessToken;
  $: $user.accessToken = accessToken;

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
  let pageState = NONE;
  let errorMessage = '';
  $: isLoggedIn = accessToken != null;
  $: pageState, resetForm();

  // PAGE FUNCTIONS
  // ==============
  async function refreshDataOnSuccess() {
    event = await getEvent(fetch, $session.API_URL, event.eventUrl, fetch);
    await nextFrame();
    pageState = NONE;
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
      accessToken = (await addUserToEvent(
          fetch, $session.API_URL, event.eventUrl, userDetails)).accessToken;
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
      accessToken = (await login(
          fetch, $session.API_URL, event.eventUrl, userDetails)).accessToken;
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }
</script>

<svelte:window
  use:undoRedo={{undo: selections.undo, redo: selections.redo}}
  use:mediaQuery={{
    query: "(min-width: 768px)",
    callback: (matches) => console.log(matches)
  }}
/>

<div class="main-content fixed-height grid" in:fadeIn out:fadeOut>
  <!-- TITLE CARD -->
  <TitleCard {...event}/>

  <!-- USER DETAILS FORM CARD -->
  {#if pageState === LOGGING_IN}
    <LoginForm
      bind:username={username}
      bind:password={password}
      {attempted}
    />
  {:else if pageState === JOINING}
    <JoinForm
      bind:username={username}
      bind:password={password}
      {attempted}
    />
  {/if}

  <!-- CALENDAR PICKER CARD -->
  <div
    class="picker-container card outline"
    class:error={pageState === JOINING && attempted && !selectionsValid}
  >
    <!-- CALENDAR PICKER CARD TITLE HEADER -->
    {#if pageState === JOINING}
    <!-- Wrap the slide transition within an extra div to prevent jitter issue
    on Chrome and Firefox -->
      <div><h3 transition:slide={{duration: 500, easing: cubicOut}}>
          Indicate your availability
      </h3></div>
    {/if}

    <!-- CALENDAR PICKER -->
    <JoinEventCalendarPicker bind:selections={$selections}
      eventIntervals={event.eventIntervals}
      userIntervalsByUsername={event.userIntervalsByUsername}
      isCollapsed={pageState === JOINING}
    />
  </div>

  <!-- BOTTOM ACTION BAR -->
  <ActionBar
    bind:pageState={pageState}
    {isLoggedIn}
    {handleSubmitLogin}
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

  .picker-container > div > h3 {
    padding: 0.8rem;
    padding-left: calc(0.8rem + 5px);
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