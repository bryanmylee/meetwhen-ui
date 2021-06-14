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

  let message = '';

  async function copy() {
    await navigator.clipboard.writeText(shareLink);
    message = 'Copied to clipboard!';
  }
</script>

<div
  on:click={dismiss}
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 !mt-0"
>
  <div
    on:click|stopPropagation={copy}
    class="p-4 space-y-2 text-white cursor-pointer card interactive bg-gradient-primary"
  >
    <h2 class="font-bold">Share this event!</h2>
    <button
      type="button"
      on:click|stopPropagation={copy}
      class="px-4 py-2 font-medium bg-white bg-opacity-25 rounded-lg hover:bg-primary-lighter active:bg-primary-darker button"
    >
      {shareLink}
    </button>
    {#if message !== ''}
      <p class="text-xs italic font-medium">{message}</p>
    {/if}
  </div>
</div>
