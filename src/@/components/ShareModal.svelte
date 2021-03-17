<script lang="ts" context="module">
  export interface ShareModalEvent {
    dismiss: null;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { event } from "@/state/event";
  import Toast from "@/components/Toast.svelte";

  const dispatch = createEventDispatcher<ShareModalEvent>();
  function dismiss() {
    dispatch("dismiss");
  }

  $: link = `meetwhen.io/${$event.data?.eventUrl}`;

  let message = "";

  async function copy() {
    await navigator.clipboard.writeText(link);
    message = "Copied to clipboard!";
  }
</script>

<div
  on:click="{dismiss}"
  transition:fade="{{ duration: 200 }}"
  class="fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50 !mt-0"
>
  <div
    on:click|stopPropagation="{copy}"
    class="p-4 space-y-4 text-white cursor-pointer card interactive bg-gradient-primary"
  >
    <h2>Share this event!</h2>
    <button
      tabindex="0"
      on:click|stopPropagation="{copy}"
      class="px-4 py-2 bg-white bg-opacity-25 card button"
    >
      {link}
    </button>
  </div>
</div>

<Toast
  bind:message
  class="p-3 mt-4 text-sm font-bold text-white card bg-primary"
/>
