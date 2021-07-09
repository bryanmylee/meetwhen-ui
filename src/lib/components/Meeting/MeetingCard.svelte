<script lang="ts">
  import type { ShallowMeeting } from '$lib/gql/types';
  import { ShareIcon } from 'svelte-feather-icons';
  import ShareModal from './ShareModal.svelte';

  export let meeting: ShallowMeeting;

  let showShareModal = false;
</script>

<div
  class="flex items-center justify-between p-4 text-white card bg-gradient-primary bg-animate-slow"
>
  <div>
    <h2 class="text-lg font-medium">
      {meeting.name}&nbsp;
    </h2>
  </div>
  <button
    type="button"
    aria-label="Share"
    on:click={() => (showShareModal = true)}
    class="w-10 h-10 -m-2 rounded-full button hover:bg-primary-darker focus:ring-white"
  >
    <ShareIcon class="p-2.5" />
  </button>
</div>

{#if showShareModal}
  <ShareModal slug={meeting.slug} on:dismiss={() => (showShareModal = false)} />
{/if}
