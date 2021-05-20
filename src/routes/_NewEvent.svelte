<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowRightIcon } from 'svelte-feather-icons';
  import { getContext } from 'svelte';
  import type { ICrossfade } from './__layout.svelte';

  const crossfade = getContext<ICrossfade>('crossfade');
  $: [send, receive] = $crossfade;
</script>

<div class="p-4 space-y-4 card">
  <h2 in:receive={{ key: 'h2' }} out:send={{ key: 'h2' }}>Get started with a new event</h2>
  <form on:submit|preventDefault={() => goto('/new')} class="flex space-x-4">
    <input type="text" placeholder="new event name..." class="flex-1" />
    <button type="submit" class="w-10 h-10 rounded-full button primary">
      <ArrowRightIcon class="p-2" />
    </button>
  </form>
</div>
