<script lang="ts" context="module">
  export interface AuthModalEvent {
    login: {
      email: string;
      password: string;
    };
    signup: {
      name: string;
      email: string;
      password: string;
    };
    dismiss: never;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import Textfield from '$lib/components/Textfield.svelte';
  import { login } from '$lib/gql/login';
  import { getAuthModalState } from './_state';
  import Header from './Header.svelte';
  import Tooltip from './Tooltip.svelte';
  import type { APIError } from '$lib/typings/error';

  const dispatch = createEventDispatcher<AuthModalEvent>();
  const { name, email, password } = getAuthModalState();

  const confirm = async () => {
    if (loggingIn) {
      await handleLogin();
    } else {
      dispatch('signup', { name: $name.value, email: $email.value, password: $password.value });
    }
  };

  const handleLogin = async () => {
    try {
      await login({ email: $email.value, password: $password.value });
      dispatch('login', { email: $email.value, password: $password.value });
    } catch (errors) {
      (errors as APIError[]).forEach(handleError);
    }
  };

  const handleError = (error: APIError) => {
    const { id } = error.extensions.exception.details;
    console.log(id);
    if (id === 'auth/user-not-found') {
      $email.error = 'User not found';
    } else if (id === 'auth/missing-email') {
      $email.error = 'Required';
    } else if (id === 'auth/wrong-password') {
      $password.error = 'Wrong password';
    }
  };

  const dismiss = () => {
    dispatch('dismiss');
  };

  let loggingIn = true;
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
    class="p-4 space-y-4 card"
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
      <button type="button" on:click={dismiss} class="w-full p-3 button shade rounded-xl">
        Cancel
      </button>
      <button type="submit" class="w-full p-3 button primary rounded-xl"> Confirm </button>
    </div>
    <Tooltip bind:hovering {transitioning} />
  </form>
</div>
