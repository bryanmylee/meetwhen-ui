<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 25] } }],
  });

  export let isGuestAuth = false;
  export let isLoggingIn = true;
  export let noGuestLogin = true;

  let hovering = false;
  export let transitioning: boolean;
</script>

{#if !isLoggingIn || !noGuestLogin}
  <button
    type="button"
    use:ref
    on:click={() => (isGuestAuth = !isGuestAuth)}
    on:blur={() => (hovering = false)}
    on:focus={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}
    on:mouseenter={() => (hovering = true)}
    class="w-full p-1 rounded-md button hover:text-primary-lighter active:text-primary"
  >
    {#if isGuestAuth}
      Use a full account?
    {:else}
      {isLoggingIn ? 'Login' : 'Join'} as guest?
    {/if}
  </button>
{/if}

{#if hovering && !transitioning}
  {#if isGuestAuth}
    <div use:content transition:fade|local={{ duration: 150 }} class="relative p-4 card">
      <h2 class="mb-2 font-bold text-center">Why use a full account?</h2>
      <ul>
        <li class="ml-4 list-disc list-outside">Save account details between meetings</li>
        <li class="ml-4 list-disc list-outside">Keep track of all meetings</li>
        <li class="ml-4 list-disc list-outside">Integrate third-party calendars</li>
      </ul>
    </div>
  {/if}
{/if}
