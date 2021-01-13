<script lang="ts">
  import { getContext } from 'svelte';
  import type { IGetCrossfade } from './_layout.svelte';

  const getCrossfade = getContext<IGetCrossfade>('getCrossfade');
  const [send, receive] = getCrossfade();
</script>

<nav
  in:receive={{key:'nav'}} out:send={{key:'nav'}}
  class="fixed top-0 left-0 right-0 p-4 bg-white card select-none-all"
  >
  <div class="relative pointer-events-none">

    <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-primary">
      meetwhen
    </span>

    <a href="/" class="absolute inset-0 text-xl font-bold pointer-events-auto -z-1 text-primary hover:underline">
      meetwhen
    </a>

  </div>
</nav>

