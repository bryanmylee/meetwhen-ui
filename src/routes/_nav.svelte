<script lang="ts">
  import { getContext } from 'svelte';
  import { page } from '$app/stores';
  import type { ICrossfade } from './__layout.svelte';

  const crossfade = getContext<ICrossfade>('crossfade');
  const [send, receive] = $crossfade;

  $: ({ path } = $page);
</script>

{#if path !== '/'}
  <nav class="fixed inset-0 bottom-auto p-4 bg-white card select-none-all">
    <div class="relative pointer-events none">
      <span class="text-transparent bg-clip-text bg-gradient-primary">meetwhen</span>
      <a href="/" class="absolute inset-0 pointer-events-auto -z-1 text-primary hover:underline">
        meetwhen
      </a>
    </div>
  </nav>
{/if}

<style lang="postcss">
  span,
  a {
    @apply text-xl font-bold;
  }
</style>
