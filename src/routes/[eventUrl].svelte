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
  }
</script>

<script lang="ts">
  import { primaryBase } from '@my/state/colors';
  import EventCalendar from '@my/components/EventCalendar.svelte';
  import type Interval from '@my/models/Interval';

  export let color: string;
  $: $primaryBase = color;
  export let eventUrl: string;
  export let name: string = '';
  export let schedule: Interval[];
  export let users: Record<string, Interval[]>;
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
  $: newUserValid = selectedSchedule.length !== 0
      && username.length !== 0
      && password.length !== 0;

  async function addNewUser() {
    const newUser = {
      eventUrl,
      username,
      password,
      schedule: selectedSchedule
    };
    const response = await event.addUser(newUser);
    if (response.error) {
      console.log(response.error);
      return;
    }
    auth.login({
      user: newUser,
      accessToken: response.accessToken,
    });
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = '';
    password = '';
  }
</script>

<div class="relative flex flex-col h-screen max-w-lg p-6 pt-20 mx-auto space-y-4">

  <div class="p-4 text-center text-white bg-gradient-primary card">
    <p>
      {name}&nbsp;
    </p>
    <p>
      {#if $auth.accessToken}
        {$auth.accessToken}
      {/if}
    </p>
  </div>

  <EventCalendar
    {schedule} {users}
    bind:selectedSchedule
    editable={pageState !== IPageState.NONE}
    class="flex flex-col flex-1 p-4 pt-0 pl-1 overflow-hidden card"
  />


  {#if pageState === IPageState.NONE}
    <div class="p-4 bg-white card">
      <h2>Find someone</h2>
      Nobody's here yet...
    </div>
  {:else}
    <div class="bg-white card flex flex-col p-4 space-y-4">
      <input type="text" bind:value={username} placeholder="Name" class="textfield"/>
      <input type="password" bind:value={password} placeholder="Password" class="textfield"/>
    </div>
  {/if}

  {#if pageState === IPageState.NONE}
    <div class="flex space-x-4">
      <button class="w-full p-3 font-bold bg-white card button focusable">
        Edit
      </button>
      <button
        on:click={() => pageState = IPageState.JOINING}
        class="w-full p-3 font-bold card button gradient"
        >
        Join Event
      </button>
    </div>
  {:else}
    <div class="flex space-x-4">
      <button
        disabled={!newUserValid}
        on:click={addNewUser}
        class="w-full p-3 font-bold card button gradient"
        >
        Confirm
      </button>
    </div>
  {/if}

</div>

