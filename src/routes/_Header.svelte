<script lang="ts">
  import { getContext } from 'svelte';
  import type { ICrossfade } from './__layout.svelte';

  const crossfade = getContext<ICrossfade>('crossfade');
  $: [send, receive] = crossfade();
</script>

<header
  in:receive={{ key: 'header' }}
  out:send={{ key: 'header' }}
  class="p-4 text-white card bg-gradient-primary"
>
  <h1 class="text-xl font-bold">meetwhen</h1>
  <p>Find the perfect time to meet up with your team</p>
</header>
