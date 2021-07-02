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
  import { signupGuest } from '$lib/gql/signupGuest';
  import Textfield from '$lib/components/Textfield.svelte';
  import IsLoggingInControl from './IsLoggingInControl.svelte';
  import IsGuestAuthControl from './IsGuestAuthControl.svelte';
  import type { APIError } from '$lib/typings/error';

  export let activeMeetingId: string | null = null;
  export let isLoggingIn = true;
  export let isGuestAuth = false;
  export let noGuestLogin = false;
  $: {
    isLoggingIn;
    resetErrors();
  }
  $: if (isLoggingIn && isGuestAuth && noGuestLogin) {
    isLoggingIn = false;
  }

  const dispatch = createEventDispatcher<AuthModalEvent>();

  const { name, email, password, resetErrors } = getAuthModalState();

  const confirm = async () => {
    try {
      if (isLoggingIn) {
        if (isGuestAuth) {
          $session.user = await loginGuest({
            meetingId: activeMeetingId,
            username: $name.value,
            password: $password.value,
          });
        } else {
          $session.user = await login({ email: $email.value, password: $password.value });
        }
      } else {
        if (isGuestAuth) {
          $session.user = await signupGuest({
            meetingId: activeMeetingId,
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
      dismiss();
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

  let transitioning = false;
</script>

<div
  transition:fade={{ duration: 200 }}
  on:introstart={() => (transitioning = true)}
  on:introend={() => (transitioning = false)}
  on:outrostart={() => (transitioning = true)}
  on:outroend={() => (transitioning = false)}
  class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 !m-0"
>
  <form
    in:fly|local={{ y: 200 }}
    on:submit|preventDefault={confirm}
    use:clickOutside={dismiss}
    class="p-4 m-4 space-y-4 card min-w-96"
  >
    <IsLoggingInControl bind:isLoggingIn {isGuestAuth} {noGuestLogin} />
    {#if !isLoggingIn || isGuestAuth}
      <div transition:slide|local={{ duration: 200 }}>
        <Textfield
          bind:value={$name.value}
          error={$name.error}
          placeholder="Name"
          required
          class="block"
        />
      </div>
    {/if}
    {#if !isGuestAuth}
      <div transition:slide|local={{ duration: 200 }}>
        <Textfield
          bind:value={$email.value}
          error={$email.error}
          placeholder="Email"
          required
          focusOnMount
          class="block"
        />
      </div>
    {/if}
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
    <IsGuestAuthControl
      bind:isGuestAuth
      {activeMeetingId}
      {isLoggingIn}
      {noGuestLogin}
      {transitioning}
    />
  </form>
</div>
