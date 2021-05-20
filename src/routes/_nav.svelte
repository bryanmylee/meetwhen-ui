<script lang="ts">
  import { getContext } from 'svelte';
  import type { ICrossfade } from './__layout.svelte';

  const crossfade = getContext<ICrossfade>('crossfade');
  $: [send, receive] = crossfade();
</script>

<nav
  in:receive={{ key: 'header' }}
  out:send={{ key: 'header' }}
  class="fixed inset-0 bottom-auto p-4 bg-white card select-none-all"
>
  <div class="relative pointer-events none">
    <span class="text-transparent bg-clip-text bg-gradient-primary">meetwhen</span>
    <a href="/" class="absolute inset-0 pointer-events-auto -z-1 text-primary hover:underline">
      meetwhen
    </a>
  </div>
</nav>

<style lang="postcss">
  span,
  a {
    @apply text-xl font-bold;
  }
</style>
