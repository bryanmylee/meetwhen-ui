<script lang="ts">
  import { getContext } from 'svelte';
  import type { ICrossfade } from '../__layout.svelte';
  import Head from '$lib/components/Head.svelte';

  const crossfade = getContext<ICrossfade>('crossfade');
  $: [send, receive] = $crossfade;
</script>

<Head emoji="✏️" subtitle="new event" />

<div class="max-w-lg p-6 pt-20 mx-auto space-y-4">
  <section class="p-4 space-y-4 card">
    <div class="flex flex-col space-y-4">
      <h2 in:receive={{ key: 'h2' }} out:send={{ key: 'h2' }}>Name your new event</h2>
      <input
        type="text"
        placeholder="..."
        in:receive={{ key: 'input' }}
        out:send={{ key: 'input' }}
      />
    </div>
    <div class="space-y-4">
      <h2>Set a time for everyone</h2>
      <div class="flex items-center space-x-4">
        <span>From</span>
        <span>To</span>
      </div>
    </div>
  </section>
  <button class="w-full p-3 button gradient card"> Create Event </button>
</div>
