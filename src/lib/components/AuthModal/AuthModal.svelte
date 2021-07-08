<script lang="ts" context="module">
  export interface AuthModalEvent {
    dismiss: {
      authenticated: boolean;
    };
  }
</script>

<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { session } from '$app/stores';
  import { clickOutside } from '$lib/utils/actions/use-click-outside';
  import { getAuthModalState } from './state';
  import { login } from '$lib/gql/login';
  import { loginGuest } from '$lib/gql/loginGuest';
  import { signup } from '$lib/gql/signup';
  import { signupGuest } from '$lib/gql/signupGuest';
  import type { APIError } from '$lib/typings/error';
  import type { Meeting } from '$lib/gql/types';
  import PlusAccountFields from './PlusAccountFields.svelte';
  import GuestAccountFields from './GuestAccountFields.svelte';
  import TabBar from './TabBar.svelte';
  import LoginSignupControl from './LoginSignupControl.svelte';
  import Description from './Description.svelte';
  import LoadingButton from '$lib/components/LoadingButton.svelte';

  export let activeMeeting: Meeting | null = null;
  export let isLoggingIn = true;
  export let isGuestAuth = false;
  export let enableGuestLogin = true;

  $: {
    isLoggingIn;
    resetErrors();
  }

  $: if (!enableGuestLogin && isLoggingIn && isGuestAuth) {
    isLoggingIn = false;
  }

  const dispatch = createEventDispatcher<AuthModalEvent>();

  const state = getAuthModalState();
  const { name, email, password, resetErrors } = state;
  setContext('state', state);

  const submitAuth = async () => {
    try {
      if (isLoggingIn) {
        if (isGuestAuth) {
          $session.user = await loginGuest({
            meetingId: activeMeeting!.id,
            username: $name.value,
            password: $password.value,
          });
        } else {
          $session.user = await login({ email: $email.value, password: $password.value });
        }
      } else {
        if (isGuestAuth) {
          $session.user = await signupGuest({
            meetingId: activeMeeting!.id,
            username: $name.value,
            password: $password.value,
          });
        } else {
          $session.user = await signup({
            name: $name.value,
            email: $email.value,
            password: $password.value,
          });
        }
      }
      dismiss(true);
    } catch (errors) {
      console.error(errors);
      if (Array.isArray(errors)) {
        (errors as APIError[]).forEach(handleAPIError);
      }
    }
  };

  const handleAPIError = (error: APIError) => {
    const { id } = error.extensions.exception.details;
    console.error({ id, message: error.message });
    if (id === 'auth/user-not-found') {
      if (isGuestAuth) {
        $name.error = 'Guest not found';
      } else {
        $email.error = 'User not found';
      }
    } else if (id === 'auth/missing-email') {
      $email.error = 'Required';
    } else if (id === 'auth/email-already-exists') {
      if (isGuestAuth) {
        $name.error = 'Name already taken';
      } else {
        $email.error = 'Email already taken';
      }
    } else if (id === 'auth/invalid-email') {
      $email.error = 'Badly formatted email';
    } else if (id === 'auth/wrong-password') {
      $password.error = 'Wrong password';
    } else if (id === 'auth/invalid-password') {
      $password.error = 'Password must be at least 6 characters long';
    } else if (id === 'auth/too-many-requests') {
      $password.error = 'Too many attempts';
    }
  };

  const dismiss = (authenticated: boolean) => {
    dispatch('dismiss', { authenticated });
  };
</script>

<div
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 !m-0"
>
  <!-- TODO: custom loading form -->
  <form in:fly|local={{ y: 200 }} use:clickOutside={() => dismiss(false)} class="m-4 card min-w-96">
    <TabBar bind:isGuestAuth enableGuestAuth={activeMeeting !== null} />
    <div class="p-4 space-y-4">
      <Description {activeMeeting} {isGuestAuth} />
      <LoginSignupControl bind:isLoggingIn {isGuestAuth} {enableGuestLogin} />
      {#if isGuestAuth}
        <GuestAccountFields />
      {:else}
        <PlusAccountFields {isLoggingIn} />
      {/if}
      <div class="flex space-x-4">
        <button
          type="button"
          on:click={() => dismiss(false)}
          class="w-full p-3 rounded-full button shade"
        >
          Cancel
        </button>
        <LoadingButton onClick={submitAuth} class="w-full p-3 rounded-full button primary">
          Confirm
        </LoadingButton>
      </div>
    </div>
  </form>
</div>
