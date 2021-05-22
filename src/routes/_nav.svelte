<script lang="ts">
  import { fly } from 'svelte/transition';
  import { receive, send } from '$lib/app-crossfade';

  export let key: string;
</script>

{#if key === '/'}
  <nav
    transition:fly={{ y: -50 }}
    class="fixed inset-0 bottom-auto flex justify-end p-4 dark:text-white"
  >
    <ul>
      <li><button class="px-2 py-1 -my-1 button primary outline rounded-xl">Login</button></li>
    </ul>
  </nav>
{:else}
  <nav
    in:receive={{ key: 'header' }}
    out:send={{ key: 'header' }}
    class="fixed inset-0 bottom-auto flex justify-between p-4 rounded-t-none card"
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
    <ul>
      <li><button class="px-2 py-1 -my-1 button primary outline rounded-xl">Login</button></li>
    </ul>
  </nav>
{/if}
