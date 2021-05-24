<script lang="ts">
  import { fly } from 'svelte/transition';
  import { receive, send } from '$lib/app-crossfade';

  export let key: string;
</script>

{#if key === '/'}
  <nav
    transition:fly={{ y: -50 }}
    class="fixed inset-0 bottom-auto flex items-center justify-end p-4 dark:text-white"
  />
{:else}
  <nav
    in:receive={{ key: 'header' }}
    out:send={{ key: 'header' }}
    class="fixed inset-0 bottom-auto flex items-center justify-between p-4 rounded-t-none card"
  >
    <ul>
      <li class="relative pointer-events-none">
        <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-primary">
          meetwhen
        </span>
        <a
          href="/"
          class="absolute inset-0 text-xl font-bold pointer-events-auto -z-1 text-primary hover:underline"
        >
          meetwhen
        </a>
      </li>
    </ul>
  </nav>
{/if}
