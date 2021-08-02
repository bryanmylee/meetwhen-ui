<script lang="ts">
  import { ScaleOut } from 'svelte-loading-spinners';
  import { cubicOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  export let key: unknown;
  export let isLoading: boolean = false;
</script>

<div class="relative">
  {#key key}
    <div transition:fade={{ duration: 150 }} class="absolute inset-0">
      <slot />
    </div>
  {/key}
  {#if isLoading}
    <div
      in:fade={{ duration: 800, delay: 300, easing: cubicOut }}
      out:fade={{ duration: 150 }}
      class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-primary"
    >
      <ScaleOut color="currentColor" duration="1.5s" size="120" />
    </div>
  {/if}
</div>
