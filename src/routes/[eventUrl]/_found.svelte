<script lang="ts" context="module">
  enum IPageState {
    NONE = 0,
    JOINING = 1,
    LOGGINGIN = 2,
    EDITING = 3,
  }
</script>

<script lang="ts">
  import watchMedia from "svelte-media";
  import { auth } from "@/state/auth";
  import { event } from "@/state/event";
  import validate from "@/utils/validator";
  import EventCalendar from "@/components/EventCalendar.svelte";
  import EventFilter from "@/components/EventFilter.svelte";
  import EventHero from "@/components/EventHero.svelte";
  import Toast from "@/components/Toast.svelte";
  import type Interval from "@/models/Interval";
  import type { Validator } from "@/utils/validator";

  export let eventUrl = "";
  export let name = "";
  export let schedule: Interval[] = [];
  export let users: Record<string, Interval[]> = {};

  $: allUsers = Object.keys(users || {}).sort();
  let unfilteredUsernames: string[] = [];
  let usersToShow: Record<string, Interval[]>;
  $: usersToShow = Object.fromEntries(
    Object.entries(users ?? {}).filter(([name]) => {
      if (unfilteredUsernames.length === 0) return true;
      return unfilteredUsernames.includes(name);
    })
  );

  let pageState = IPageState.NONE;

  let selectedSchedule: Interval[] = [];
  let username = "";
  let password = "";

  function cancel() {
    selectedSchedule = [];
    username = "";
    password = "";
    pageState = IPageState.NONE;
  }

  let errorMessage = "";

  $: newUser = {
    schedule: selectedSchedule,
    username,
    password,
    eventUrl,
  };
  const newUserValidator: Validator<typeof newUser> = {
    schedule: (schedule: Interval[]) =>
      schedule.length <= 0 ? "Pick at least one day" : null,
    username: (name: string) => {
      if (name.trim().length <= 0) return "Your name cannot be empty";
      if (!name.match(/^[A-Za-z0-9]+$/))
        return "Your name must only be letters and numbers";
      return null;
    },
    password: (password: string) =>
      password.trim().length <= 0 ? "Your password cannot be empty" : null,
    eventUrl: null,
  };
  $: newUserValidation = validate(newUser, newUserValidator);
  async function addNewUser() {
    if (newUserValidation.schedule) {
      errorMessage = newUserValidation?.schedule as string;
      return;
    }
    if (newUserValidation.username) {
      errorMessage = newUserValidation?.username as string;
      return;
    }
    if (newUserValidation.password) {
      errorMessage = newUserValidation?.password as string;
      return;
    }
    const response = await event.addUser(newUser);
    if (response.error) {
      errorMessage = response.error;
      return;
    }
    auth.loginWithToken(response.accessToken);
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = "";
    password = "";
  }

  function initEditUser() {
    pageState = IPageState.EDITING;
    selectedSchedule = users[$auth.data.username];
  }

  $: editedUser = {
    schedule: selectedSchedule,
  };
  const editedUserValidator: Validator<typeof editedUser> = {
    schedule: (schedule: Interval[]) =>
      schedule.length <= 0 ? "Pick at least one day" : null,
  };
  $: editedUserValidation = validate(editedUser, editedUserValidator);
  async function editUser() {
    if (editedUserValidation.schedule) {
      errorMessage = editedUserValidation.schedule as string;
      return;
    }
    const response = await event.editUserSchedule($auth.data, selectedSchedule);
    if (response.error) {
      errorMessage = response.error;
      return;
    }
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = "";
    password = "";
  }

  $: logInDetails = {
    username,
    password,
  };
  const logInValidator: Validator<typeof logInDetails> = {
    username: (name: string) => {
      if (name.trim().length <= 0) return "Your name cannot be empty";
      return null;
    },
    password: (password: string) =>
      password.trim().length <= 0 ? "Your password cannot be empty" : null,
  };
  $: logInValidation = validate(logInDetails, logInValidator);
  async function logIn() {
    if (logInValidation.username) {
      errorMessage = logInValidation.username as string;
      return;
    }
    if (logInValidation.password) {
      errorMessage = logInValidation.password as string;
      return;
    }
    const response = await auth.loginWithPassword(username, password, eventUrl);
    if (response.error) {
      errorMessage = response.error;
      return;
    }
    pageState = IPageState.NONE;
    selectedSchedule = [];
    username = "";
    password = "";
  }

  async function logOut() {
    auth.logout();
    pageState = IPageState.NONE;
  }

  const media = watchMedia({
    md: "(min-width: 768px)",
  });

  let containerWidth = 0;
  let leftColWidth = 0;
  $: calendarWidth = containerWidth - leftColWidth - 64;
</script>

<div
  bind:clientWidth="{containerWidth}"
  class="relative flex flex-col h-screen max-w-lg p-6 pt-20 mx-auto space-y-4 md:flex-wrap md:max-w-7xl md:justify-items-center"
>
  <div bind:clientWidth="{leftColWidth}" class="md:min-w-64 md:max-w-96">
    <EventHero eventName="{name}" />
  </div>

  <EventCalendar
    schedule="{schedule}"
    users="{usersToShow}"
    bind:selectedSchedule
    editable="{pageState === IPageState.JOINING ||
      pageState === IPageState.EDITING}"
    class="flex-1 overflow-hidden bg-white card md:order-3 md:basis-full md:!mt-0 md:ml-4"
    style="{$media.md ? `width: ${calendarWidth}px` : ''}"
  />

  <div class="md:min-w-64 md:max-w-96">
    {#if pageState === IPageState.JOINING}
      <form
        on:submit|preventDefault
        class="flex flex-col p-4 space-y-4 bg-white card"
      >
        <!--h2>Join Event</h2-->
        <input
          type="text"
          bind:value="{username}"
          placeholder="Name"
          class="textfield"
        />
        <input
          type="password"
          bind:value="{password}"
          placeholder="Password"
          class="textfield"
        />
      </form>
    {:else if pageState === IPageState.LOGGINGIN}
      <form
        on:submit|preventDefault
        class="flex flex-col p-4 space-y-4 bg-white card"
      >
        <!--h2>Log In</h2-->
        <input
          type="text"
          bind:value="{username}"
          placeholder="Name"
          class="textfield"
        />
        <input
          type="password"
          bind:value="{password}"
          placeholder="Password"
          class="textfield"
        />
      </form>
    {:else}
      <EventFilter
        allUsers="{allUsers}"
        bind:selectedUsers="{unfilteredUsernames}"
      />
    {/if}
  </div>

  <div class="flex space-x-4 md:min-w-64 md:max-w-96">
    {#if pageState === IPageState.NONE}
      {#if $auth.data}
        <button on:click="{logOut}" class="w-full p-3 bg-white card button">
          Log Out
        </button>
        <button
          on:click="{initEditUser}"
          class="w-full p-3 card button gradient"
        >
          Edit
        </button>
      {:else}
        <button
          on:click="{() => (pageState = IPageState.LOGGINGIN)}"
          class="w-full p-3 bg-white card button"
        >
          Log In
        </button>
        <button
          on:click="{() => (pageState = IPageState.JOINING)}"
          class="w-full p-3 card button gradient animate-bump-y hover:animate-none"
        >
          Join Event
        </button>
      {/if}
    {:else if pageState === IPageState.JOINING}
      <button on:click="{cancel}" class="w-full p-3 bg-white card button">
        Cancel
      </button>
      <button on:click="{addNewUser}" class="w-full p-3 card button gradient">
        Confirm
      </button>
    {:else if pageState === IPageState.LOGGINGIN}
      <button on:click="{cancel}" class="w-full p-3 bg-white card button">
        Cancel
      </button>
      <button on:click="{logIn}" class="w-full p-3 card button gradient">
        Confirm
      </button>
    {:else if pageState === IPageState.EDITING}
      <button on:click="{cancel}" class="w-full p-3 bg-white card button">
        Cancel
      </button>
      <button on:click="{editUser}" class="w-full p-3 card button gradient">
        Confirm
      </button>
    {/if}
  </div>
</div>

<Toast
  bind:message="{errorMessage}"
  class="p-3 mt-4 text-sm font-bold text-white bg-red-400 rounded-xl"
/>
