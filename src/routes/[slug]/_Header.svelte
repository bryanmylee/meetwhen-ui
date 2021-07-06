<script lang="ts">
  import { showShare } from './_state/page';
  import { ShareIcon } from 'svelte-feather-icons';
  import ShareModal from './_ShareModal.svelte';
  import { session } from '$app/stores';

  export let name = '';
  export let slug = '';

  $: isGuest = $session.user?.guestOf !== null;
</script>

<div class="flex items-center justify-between p-4 text-white card bg-gradient-primary">
  <div>
    <p class="text-lg font-medium">
      {name}&nbsp;
    </p>
    {#if $session.user !== null}
      <p class="text-xs italic text-white">
        Logged in as {isGuest ? 'guest ' : ''}<strong>{$session.user.name}</strong>
      </p>
    {/if}
  </div>
  <button
    type="button"
    aria-label="Share"
    on:click={() => ($showShare = true)}
    class="w-10 h-10 -m-2 rounded-full button hover:bg-primary-darker focus:ring-white"
  >
    <ShareIcon class="p-2.5" />
  </button>
</div>

{#if $showShare}
  <ShareModal {slug} on:dismiss={() => ($showShare = false)} />
{/if}
