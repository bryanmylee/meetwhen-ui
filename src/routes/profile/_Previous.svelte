<script lang="ts">
  import { slide } from 'svelte/transition';
  import Accordian from '$lib/components/Accordian.svelte';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { classes } from '$lib/utils/classes';
  import { ChevronDownIcon } from 'svelte-feather-icons';
  import MeetingItem from './_MeetingItem.svelte';

  export let previousMeetings: ShallowMeeting[];
</script>

<section>
  <Accordian
    xclass={({ expanded }) => expanded && 'card'}
    xtitleclass={({ expanded }) =>
      classes([
        'flex justify-between w-full p-4 card focus:outline-none focus:ring ring-inset ring-primary-lighter',
        expanded && '!shadow-none rounded-b-none',
      ])}
    let:expanded
  >
    <svelte:fragment slot="title">
      <h1 class="text-lg font-medium">Previous meetings</h1>
      <ChevronDownIcon class="p-2 -m-2 w-10 h-10 transition transform {expanded && 'rotate-180'}" />
    </svelte:fragment>
    <ul class="space-y-4 p-4 pt-0" transition:slide|local>
      {#each previousMeetings as meeting}
        <MeetingItem {meeting} />
      {/each}
    </ul>
  </Accordian>
</section>
