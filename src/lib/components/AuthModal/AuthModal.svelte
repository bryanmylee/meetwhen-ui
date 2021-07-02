<script lang="ts" context="module">
  export interface AuthModalEvent {
    dismiss: never;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { session } from '$app/stores';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import { getAuthModalState } from './state';
  import { login } from '$lib/gql/login';
  import { loginGuest } from '$lib/gql/loginGuest';
  import { signup } from '$lib/gql/signup';
  import Textfield from '$lib/components/Textfield.svelte';
  import Header from './Header.svelte';
  import Tooltip from './Tooltip.svelte';
  import type { APIError } from '$lib/typings/error';

  export let guestOfMeetingId: string | null = null;

  const dispatch = createEventDispatcher<AuthModalEvent>();

  const { name, email, password, resetErrors } = getAuthModalState();

  let loggingIn = true;
  $: {
    loggingIn;
    resetErrors();
  }

  const confirm = async () => {
    try {
      if (loggingIn) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (errors) {
      console.error(errors);
      if (Array.isArray(errors)) {
        (errors as APIError[]).forEach(handleAPIError);
      }
    }
  };

  const handleLogin = async () => {
    if (guestOfMeetingId === null) {
      $session.user = await login({ email: $email.value, password: $password.value });
    } else {
      $session.user = await loginGuest({
        meetingId: guestOfMeetingId,
        username: $name.value,
        password: $password.value,
      });
    }
    dismiss();
  };

  const handleSignup = async () => {
    if (guestOfMeetingId === null) {
      $session.user = await signup({
        name: $name.value,
        email: $email.value,
        password: $password.value,
      });
    } else {
      // TODO: signupGuest
    }
    dismiss();
  };

  const handleAPIError = (error: APIError) => {
    const { id } = error.extensions.exception.details;
    console.error({ id, message: error.message });
    if (id === 'auth/user-not-found') {
      $email.error = 'User not found';
    } else if (id === 'auth/missing-email') {
      $email.error = 'Required';
    } else if (id === 'auth/email-already-exists') {
      $email.error = 'Email already taken';
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

  const dismiss = () => {
    dispatch('dismiss');
  };

  let hovering = false;
  let transitioning = false;
</script>

<div
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
>
  <form
    in:fly|local={{ y: 200 }}
    on:introstart={() => (transitioning = true)}
    on:introend={() => (transitioning = false)}
    on:submit|preventDefault={confirm}
    use:clickOutside={dismiss}
    class="p-4 m-4 space-y-4 card"
  >
    <Header bind:loggingIn />
    {#if !loggingIn}
      <div transition:slide={{ duration: 200 }}>
        <Textfield
          bind:value={$name.value}
          error={$name.error}
          placeholder="Name"
          required
          class="block"
        />
      </div>
    {/if}
    <Textfield
      bind:value={$email.value}
      error={$email.error}
      placeholder="Email"
      required
      focusOnMount
      class="block"
    />
    <Textfield
      bind:value={$password.value}
      error={$password.error}
      placeholder="Password"
      required
      password
      class="block"
    />
    <div class="flex space-x-4">
      <button type="button" on:click={dismiss} class="w-full p-3 rounded-full button shade">
        Cancel
      </button>
      <button type="submit" class="w-full p-3 rounded-full button primary"> Confirm </button>
    </div>
    <Tooltip bind:hovering {transitioning} />
  </form>
</div>
