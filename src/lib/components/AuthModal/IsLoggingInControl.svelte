<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';

  const [send, receive] = crossfade({ duration: 200, easing: cubicOut });

  export let isLoggingIn = true;
  export let isGuestAuth = false;
  export let noGuestLogin = false;

  $: loginLabel = isGuestAuth ? 'Login as Guest' : 'Login';
  $: joinLabel = isGuestAuth ? 'Join as Guest' : 'Join';
</script>

<h1 class="relative w-full h-8">
  {#if isLoggingIn}
    <div in:receive={{ key: 'login' }} out:send={{ key: 'login' }}>{loginLabel}</div>
  {:else}
    <div in:receive={{ key: 'join' }} out:send={{ key: 'join' }}>{joinLabel}</div>
  {/if}
  {#if isLoggingIn}
    <button
      type="button"
      on:click={() => (isLoggingIn = false)}
      in:receive={{ key: 'join' }}
      out:send={{ key: 'join' }}
      class="absolute right-0 underline top-1 hover:text-primary focus:text-primary"
    >
      Join
    </button>
  {:else if !isGuestAuth || !noGuestLogin}
    <button
      type="button"
      on:click={() => (isLoggingIn = true)}
      in:receive={{ key: 'login' }}
      out:send={{ key: 'login' }}
      class="absolute left-0 underline top-1 hover:text-primary focus:text-primary"
    >
      Login
    </button>
  {/if}
</h1>

<style lang="postcss">
  h1 > div {
    @apply absolute text-xl font-bold transform -translate-x-1/2 left-1/2;
  }
</style>
