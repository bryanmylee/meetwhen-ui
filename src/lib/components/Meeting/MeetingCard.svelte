<script lang="ts">
  import type { ShallowMeeting } from '$lib/gql/types';
  import { onSubmitKey } from '$lib/utils/on-submit-key';
  import { ShareIcon } from 'svelte-feather-icons';
  import ShareModal from './ShareModal.svelte';
  import { classes } from '$lib/utils/classes';
  import { getCssVars, getColorSet } from '$lib/utils/stores/colors-store';

  export let meeting: Pick<ShallowMeeting, 'name' | 'slug' | 'color'>;

  const cardClass =
    'flex items-center justify-between !text-primary-text card p-4 bg-gradient-primary bg-animate-slow';
  $: colorVars = getCssVars('primary', getColorSet(meeting.color));

  let showShareModal = false;
</script>

<div on:click class={cardClass} style={colorVars}>
  <div>
    <h2 class="text-lg font-medium">
      {meeting.name}&nbsp;
    </h2>
  </div>
  <button
    type="button"
    aria-label="Share"
    on:keydown|stopPropagation={onSubmitKey(() => (showShareModal = true))}
    on:click|preventDefault|stopPropagation={() => (showShareModal = true)}
    class="w-10 h-10 -m-2 rounded-full button hover:bg-primary-darker focus:ring-primary-text"
  >
    <ShareIcon class="p-2.5" />
  </button>
</div>

{#if showShareModal}
  <ShareModal slug={meeting.slug} on:dismiss={() => (showShareModal = false)} />
{/if}
