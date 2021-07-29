<script lang="ts">
  import Accordian from '$lib/components/Accordian.svelte';
  import MeetingItem from './_MeetingItem.svelte';
  import { ChevronDownIcon } from 'svelte-feather-icons';
  import { classes } from '$lib/utils/classes';
  import { entriesById } from '$lib/utils/entries-by-id';
  import { slide } from 'svelte/transition';
  import type { ShallowMeeting } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';

  export let previousMeetings: ShallowMeeting[];
  $: groupedEntries = entriesById(previousMeetings, {
    getKey: (item) => item.total.beg,
    keyEqual: (lhs: Dayjs, rhs: Dayjs) => lhs.isSame(rhs, 'date'),
  });
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
      {#each groupedEntries as [date, meetings]}
        <li class="flex space-x-4">
          <div class="py-2 w-12">
            {date.format('DD MMM')}
          </div>
          <ul class="space-y-4 flex-1">
            {#each meetings as meeting}
              <MeetingItem {meeting} />
            {/each}
          </ul>
        </li>
      {:else}
        No upcoming meetings...
      {/each}
    </ul>
  </Accordian>
</section>
