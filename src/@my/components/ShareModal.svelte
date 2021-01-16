<script lang="ts" context="module">
  export interface ShareModalEvent {
    dismiss: null;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition'
  import { event } from '@my/state/event';
  const dispatch = createEventDispatcher<ShareModalEvent>();

  $: link = `meetwhen.io/${$event.data?.eventUrl}`

  function dismiss() {
    dispatch('dismiss');
  }

  function copy() {
    alert('yo')
  }
</script>

<div
  on:click={dismiss}
  transition:fade={{duration:200}}
  class="fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50 !mt-0"
  >
  <div on:click|stopPropagation={copy} class="p-4 text-white cursor-pointer card bg-gradient-primary space-y-4 button">
    <h2>Share this event!</h2>
    <button tabindex=0 on:click|stopPropagation={copy} class="px-4 py-2 bg-white card bg-opacity-25 button">
      {link}
    </button>
  </div>
</div>

