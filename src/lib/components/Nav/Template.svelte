<script lang="ts">
  import { fly } from 'svelte/transition';
  import { receive, send } from '$lib/app-crossfade';

  export let key: string;
</script>

{#if key === '/'}
  <nav
    transition:fly={{ y: -50 }}
    class="fixed inset-0 bottom-auto flex items-center justify-end p-4 dark:text-white"
  >
    <ul class="flex items-center space-x-3">
      <slot name="right" />
    </ul>
  </nav>
{:else}
  <nav
    in:receive={{ key: 'header' }}
    out:send={{ key: 'header' }}
    class="fixed inset-0 bottom-auto flex items-center justify-between p-4 rounded-t-none card"
  >
    <ul class="flex items-center space-x-3">
      <slot name="left" />
    </ul>
    <ul class="flex items-center space-x-3">
      <slot name="right" />
    </ul>
  </nav>
{/if}
