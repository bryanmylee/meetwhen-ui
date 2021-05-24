<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';

  const [send, receive] = crossfade({ duration: 200, easing: cubicOut });

  export let loggingIn: boolean;
</script>

<h1 class="relative w-full h-8">
  {#if loggingIn}
    <div in:receive={{ key: 'login' }} out:send={{ key: 'login' }}>Login</div>
  {:else}
    <div in:receive={{ key: 'signup' }} out:send={{ key: 'signup' }}>Sign Up</div>
  {/if}
  {#if !loggingIn}
    <button
      on:click={() => (loggingIn = true)}
      in:receive={{ key: 'login' }}
      out:send={{ key: 'login' }}
      class="absolute left-0 underline top-1 hover:text-primary focus:text-primary"
    >
      Login
    </button>
  {:else}
    <button
      on:click={() => (loggingIn = false)}
      in:receive={{ key: 'signup' }}
      out:send={{ key: 'signup' }}
      class="absolute right-0 underline top-1 hover:text-primary focus:text-primary"
    >
      Sign Up
    </button>
  {/if}
</h1>

<style lang="postcss">
  h1 > div {
    @apply absolute text-2xl font-bold transform -translate-x-1/2 left-1/2;
  }
</style>
