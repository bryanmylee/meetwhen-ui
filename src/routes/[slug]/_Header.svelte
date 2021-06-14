<script lang="ts">
  import { guestUser, modalState, showShare } from './_state/page';
  import type { ModalState } from './_state/page';
  import { ShareIcon } from 'svelte-feather-icons';
  import ShareModal from './_ShareModal.svelte';

  export let name = '';
  export let slug = '';

  const statesWithTextfield: ModalState[] = ['add-auth', 'add-guest'];
</script>

{#if !statesWithTextfield.includes($modalState)}
  <div class="flex items-center justify-between p-4 text-white card bg-gradient-primary">
    <div>
      <p class="text-lg font-medium">
        {name}&nbsp;
      </p>
      {#if $guestUser !== null}
        <p class="text-xs italic text-white">
          Logged in as guest <strong>{$guestUser.name}</strong>
        </p>
      {/if}
    </div>
    <button
      type="button"
      on:click={() => ($showShare = true)}
      class="w-10 h-10 -m-2 rounded-full button hover:bg-primary-darker focus:ring-white"
    >
      <ShareIcon class="p-2.5" />
    </button>
  </div>
{/if}

{#if $showShare}
  <ShareModal {slug} on:dismiss={() => ($showShare = false)} />
{/if}
