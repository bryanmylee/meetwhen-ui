<script lang="ts" context="module">
  const [send, receive] = crossfade({
    duration: (d: number) => d * 2,
    easing: cubicOut,
  });
</script>

<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { onSubmitKey } from '$lib/utils/on-submit-key';
  import { ShareIcon } from 'svelte-feather-icons';
  import ShareModal from './ShareModal.svelte';
  import { classes } from '$lib/utils/classes';

  export let meeting: Pick<ShallowMeeting, 'name' | 'slug'>;
  export let dimmed = false;

  $: cardClass = classes([
    'flex items-center justify-between text-white card p-4 z-50',
    dimmed ? '!bg-primary-fifty opacity-75' : 'bg-gradient-primary bg-animate-slow ',
  ]);

  let showShareModal = false;
</script>

<div in:receive={{ key: meeting.slug }} out:send={{ key: meeting.slug }} on:click class={cardClass}>
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
    class="w-10 h-10 -m-2 rounded-full button hover:bg-primary-darker focus:ring-white"
  >
    <ShareIcon class="p-2.5" />
  </button>
</div>

{#if showShareModal}
  <ShareModal slug={meeting.slug} on:dismiss={() => (showShareModal = false)} />
{/if}
