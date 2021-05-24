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
  import { slide } from 'svelte/transition';
  import Textfield from '$lib/components/Textfield.svelte';
  import Header from './Header.svelte';
  import Tooltip from './Tooltip.svelte';

  const dispatch = createEventDispatcher<AuthModalEvent>();

  let name: string;
  let email: string;
  let password: string;

  const confirm = () => {
    if (loggingIn) {
      dispatch('login', {
        email,
        password,
      });
    } else {
      dispatch('signup', {
        name,
        email,
        password,
      });
    }
  };

  const dismiss = () => {
    dispatch('dismiss');
  };

  let loggingIn = true;
  let hovering = false;
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
  <form on:submit|preventDefault={confirm} class="p-4 space-y-4 card">
    <Header bind:loggingIn />
    {#if !loggingIn}
      <div transition:slide={{ duration: 200 }}>
        <Textfield bind:value={name} placeholder="Name" class="block" />
      </div>
    {/if}
    <Textfield bind:value={email} placeholder="Email" class="block" />
    <Textfield bind:value={password} placeholder="Password" password class="block" />
    <div class="flex space-x-4">
      <button on:click|preventDefault={dismiss} class="w-full p-3 button shade rounded-xl">
        Cancel
      </button>
      <button type="submit" class="w-full p-3 button primary rounded-xl"> Confirm </button>
    </div>
    <Tooltip bind:hovering />
  </form>
</div>
