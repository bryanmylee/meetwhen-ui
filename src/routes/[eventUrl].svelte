<svelte:head>
  <title>meetwhen.io 📘 {name}</title>
  <meta name="robots" content="noindex"/>
</svelte:head>

<script lang="ts" context="module">
  import { get } from 'svelte/store';
  import { auth } from '@my/state/auth';
  import { event } from '@my/state/event';
  import type Common from '@sapper/common';

  export const preload: Common.Preload = async function(this, page, session) {
    const { eventUrl } = page.params;
    const $event = get(event);
    if ($event.pending) {
      this.redirect(301, '/event');
    }
    if ($event.data == null || $event.data.eventUrl !== eventUrl) {
      const data = await event.get(eventUrl);
      if (data != null && data.accessToken != null) {
        auth.loginWithToken(data.accessToken);
      }
    }
    return $event.data;
  }

  enum IPageState {
    NONE = 0,
    JOINING = 1,
    LOGGINGIN = 2,
    EDITING = 3,
  }
</script>

<script lang="ts">
  import { primaryBase } from '@my/state/colors';
  import EventCalendar from '@my/components/EventCalendar.svelte';
  import EventFilter from '@my/components/EventFilter.svelte';
  import type Interval from '@my/models/Interval';

  export let color: string;
  $: $primaryBase = color;
  export let eventUrl: string;
  export let name: string = '';
  export let schedule: Interval[];
  export let users: Record<string, Interval[]>;
  $: allUsers = Object.keys(users || {}).sort();
  $: {
    const { data } = $event;
    if (data) {
      color = data.color;
      eventUrl = data.eventUrl;
      name = data.name;
      schedule = data.schedule;
      users = data.users;
    }
  }

  let pageState = IPageState.NONE;

  let selectedSchedule: Interval[] = [];
  let username = '';
  let password = '';
  $: joiningValid = selectedSchedule.length !== 0
      && username.length !== 0
      && password.length !== 0;
  $: loggingInValid = username.length !== 0 && password.length !== 0;
  $: editingValid = selectedSchedule.length !== 0;

  function cancel() {
    selectedSchedule = [];
    username = '';
    password = '';
    pageState = IPageState.NONE;
  }

  async function addNewUser() {
    const response = await event.addUser({
      eventUrl,
      username,
      password,
      schedule: selectedSchedule
    });
    if (response.error) {
      console.log(response.error);
      return;
    }
    auth.loginWithToken(response.accessToken);
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = '';
    password = '';
  }

  function initEditUser() {
    pageState = IPageState.EDITING;
    selectedSchedule = users[$auth.data.username];
  }

  async function editUser() {
    const response = await event.editUserSchedule($auth.data, selectedSchedule);
    if (response.error) {
      console.log(response.error);
      return;
    }
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = '';
    password = '';
  }

  async function logIn() {
    const response = await auth.loginWithPassword(username, password, eventUrl);
    if (response.error) {
      console.log(response.error);
      return;
    }
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = '';
    password = '';
  }

  async function logOut() {
    auth.logout();
    pageState = IPageState.NONE;
  }
</script>

<div class="relative flex flex-col h-screen max-w-lg p-6 pt-20 mx-auto space-y-4">

  <div class="p-4 text-center text-white bg-gradient-primary card">
    <p>
      {name}&nbsp;
    </p>
    {#if $auth.data}
      <p class="italic text-xs">
        Logged in as {$auth.data.username}
      </p>
    {/if}
  </div>

  <EventCalendar
    {schedule} {users}
    bind:selectedSchedule
    editable={pageState === IPageState.JOINING || pageState === IPageState.EDITING}
    class="flex flex-col flex-1 p-4 pt-0 pl-1 overflow-hidden card"
  />


  {#if pageState === IPageState.JOINING}
    <div class="flex flex-col p-4 bg-white card space-y-4">
      <h2>Join Event</h2>
      <input type="text" bind:value={username} placeholder="Name" class="textfield"/>
      <input type="password" bind:value={password} placeholder="Password" class="textfield"/>
    </div>
  {:else if pageState === IPageState.LOGGINGIN}
    <div class="flex flex-col p-4 bg-white card space-y-4">
      <h2>Log In</h2>
      <input type="text" bind:value={username} placeholder="Name" class="textfield"/>
      <input type="password" bind:value={password} placeholder="Password" class="textfield"/>
    </div>
  {:else}
    <EventFilter {allUsers}/>
  {/if}

  <div class="flex space-x-4">
    {#if pageState === IPageState.NONE}
      {#if $auth.data}
        <button
          on:click={logOut}
          class="w-full p-3 font-bold bg-white card button focusable"
          >
          Log Out
        </button>
        <button
          on:click={initEditUser}
          class="w-full p-3 font-bold card button gradient focusable"
          >
          Edit
        </button>
      {:else}
        <button
          on:click={() => pageState = IPageState.LOGGINGIN}
          class="w-full p-3 font-bold bg-white card button focusable"
          >
          Log In
        </button>
        <button
          on:click={() => pageState = IPageState.JOINING}
          class="w-full p-3 font-bold card button gradient focusable"
          >
          Join Event
        </button>
      {/if}
    {:else if pageState === IPageState.JOINING}
      <button
        on:click={cancel}
        class="w-full p-3 font-bold bg-white card button focusable"
        >
        Cancel
      </button>
      <button
        disabled={!joiningValid}
        on:click={addNewUser}
        class="w-full p-3 font-bold card button gradient focusable"
        >
        Confirm
      </button>
    {:else if pageState === IPageState.LOGGINGIN}
      <button
        on:click={cancel}
        class="w-full p-3 font-bold bg-white card button focusable"
        >
        Cancel
      </button>
      <button
        disabled={!loggingInValid}
        on:click={logIn}
        class="w-full p-3 font-bold card button gradient focusable"
        >
        Confirm
      </button>
    {:else if pageState === IPageState.EDITING}
      <button
        on:click={cancel}
        class="w-full p-3 font-bold bg-white card button focusable"
        >
        Cancel
      </button>
      <button
        disabled={!editingValid}
        on:click={editUser}
        class="w-full p-3 font-bold card button gradient focusable"
        >
        Confirm
      </button>
    {/if}
  </div>

</div>

