<script lang="ts" context="module">
  export interface ShareModalEvent {
    dismiss: never;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher<ShareModalEvent>();
  function dismiss() {
    dispatch('dismiss');
  }

  export let slug = '';
  $: shareLink = `meetwhen.io/${slug}`;

  let message = 'Click to copy';

  const handleClick = () => {
    copy();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      message = 'Copied to clipboard!';
    } catch {
      message = 'Click to copy not supported';
    }
  };
</script>

<div
  on:click={dismiss}
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 !mt-0"
>
  <div on:click|stopPropagation={handleClick} class="p-4 space-y-2 cursor-pointer group card">
    <h2 class="text-lg font-medium">Share this event!</h2>
    <div class="relative rounded-lg shade">
      <div
        class="absolute inset-0 transition-all rounded-lg opacity-0 group-hover:opacity-100 group-hover:bg-gradient-primary hover:bg-animate-fast"
      />
      <div class="relative px-4 py-2 cursor-text group-hover:text-white">
        {shareLink}
      </div>
    </div>
    {#if message !== ''}
      <p class="text-xs italic font-medium text-center">{message}</p>
    {/if}
  </div>
</div>
