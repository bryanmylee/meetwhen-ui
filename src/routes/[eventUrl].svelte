<svelte:options immutable={true}/>

<script context="module">
  import { getEvent } from '../api/event.js';
  import { login, getAccessToken } from '../api/authentication.js';

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

  import { user } from '../stores.js';
  import { undoRedo } from '../actions/hotkeys.js';
  import undoable from '../utils/undoable.js';
  import nextFrame from '../utils/nextFrame.js';
  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';
  import { addUserToEvent } from '../api/event.js';

  import { JoinEventCalendarPicker } from '../components/calendar';
  import { Button, TextInput } from '../components/form';

  // Preloaded data
  export let event;
  export let accessToken;
  $: $user.accessToken = accessToken;

  // Page state
  let isJoining = false;
  let errorMessage = '';
  $: isLoggedIn = accessToken != null;

  // Form data
  let username = '';
  let password = '';
  const [ selections, undo, redo, canUndo, canRedo, clearStack ] = undoable([]);

  // Form metadata
  let attempted = false;
  $: userDetailsValid = username.trim().length !== 0
      && password.trim().length !== 0;
  $: selectionsValid = $selections.length !== 0;

  // API Functions
  async function handleNewUser() {
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

  async function handleLogin() {
    try {
      accessToken = (await login(fetch, $session.API_URL, event.eventUrl, {
        username: 'testlogin',
        password: 'testlogin',
      })).accessToken;
      refreshDataOnSuccess();
    } catch (err) {
      errorMessage = err.message;
    }
  }

  async function refreshDataOnSuccess() {
    event = await getEvent(fetch, $session.API_URL, event.eventUrl, fetch);
    await nextFrame();
    resetForm();
  }

  function resetForm() {
    isJoining = false;
    errorMessage = '';
    username = '';
    password = '';
    $selections = [];
    clearStack();
    attempted = false;
  }
</script>

<svelte:window use:undoRedo={{ undo, redo }} />

<div class="page" in:fadeIn out:fadeOut>
  <!-- TITLE CARD -->
  <div class="card__outline section">
    <h1>{event.title}</h1>
    {#if event.description}
      <p>{event.description}</p>
    {/if}
  </div>

  <!-- USER DETAILS FORM CARD -->
  {#if isJoining}
    <div
      class="card__outline section"
      class:error={attempted && !userDetailsValid}
      transition:slide={{duration: 500, easing: cubicOut}}
    >
      <!-- Content of div with slide transitions is not masked properly on
      Safari. Therefore, implement a nice fade in after div is fully sized. -->
      <div transition:fade={{duration: 150, delay: 500}}>
        <h3>Create an account</h3>
        <TextInput label="Username" bind:value={username} required {attempted} />
        <TextInput label="Password" isPassword bind:value={password} required {attempted} />
        <h5>Account is unique to this event only</h5>
      </div>
    </div>
  {/if}

  <!-- CALENDAR PICKER CARD -->
  <div
    class="picker-container card__outline"
    class:error={attempted && !selectionsValid}
  >
    <!-- CALENDAR PICKER CARD TITLE HEADER -->
    {#if isJoining}
    <!-- Wrap the slide transition within an extra div to prevent jitter issue
    on Chrome and Firefox -->
      <div>
        <h3 transition:slide={{duration: 500, easing: cubicOut}}>
          Indicate your availability
        </h3>
      </div>
    {/if}

    <!-- CALENDAR PICKER -->
    <div class="picker">
      <JoinEventCalendarPicker bind:selections={$selections}
        eventIntervals={event.eventIntervals}
        userIntervalsByUsername={event.userIntervalsByUsername}
        isCollapsed={isJoining}
      />
    </div>
  </div>

  <!-- BOTTOM BUTTON BAR -->
  <div class="bottom-bar">
    <!-- ERROR MESSAGE -->
    {#if errorMessage.length !== 0}
      <span class="error" transition:fade={{duration: 150}}>
        {errorMessage}
      </span>
    {/if}

    <!-- BUTTONS -->
    {#if isLoggedIn}
      <Button>Edit selections</Button>
    {:else}
      {#if isJoining}
        <div class="button__container">
          <Button on:click={handleNewUser}>Confirm</Button>
        </div>
      {:else}
        <div class="button__container">
          <Button on:click={() => isJoining = true}>Join Event</Button>
        </div>
        <div class="button__container">
          <Button on:click={handleLogin}>Login</Button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .page {
    /* Allows the calendar to dynamically resize */
    display: grid;
    gap: 1rem;
    width: 100%;
    height: 100vh;
    padding: 1em;
    box-sizing: border-box;
    background-color: var(--background-1);
  }

  h1 {
    margin: 0;
  }

  p {
    margin: 0.5em 0 0;
  }

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

  .picker {
    overflow: scroll;
    scroll-behavior: smooth;
  }

  h3 {
    color: var(--text-1);
    margin: 0;
    padding: 0 5px 5px;
    font-weight: 700;
  }

  h5 {
    color: var(--text-3);
    padding-left: 5px;
    margin: 0;
    font-size: 0.8em;
    font-style: italic;
    font-weight: 400;
  }

  .bottom-bar {
    display: flex;
    align-items: center;
    justify-self: end;
  }

  .button__container {
    min-width: -moz-max-content;
    min-width: -webkit-max-content;
    margin-left: 1rem;
  }

  @media screen and (min-width: 50rem) {
    .page {
      grid-template-columns: 2fr 3fr;
      grid-auto-flow: column;
    }

    .picker-container {
      grid-row: 1/6;
      grid-column: 2/3;
    }
  }
</style>