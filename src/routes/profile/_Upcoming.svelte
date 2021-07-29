<script lang="ts">
  import MeetingItem from './_MeetingItem.svelte';
  import { entriesById } from '$lib/utils/entries-by-id';
  import type { ShallowMeeting } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';

  export let upcomingMeetings: ShallowMeeting[] = [];
  $: groupedEntries = entriesById(upcomingMeetings, {
    getKey: (item) => item.total.beg,
    keyEqual: (lhs: Dayjs, rhs: Dayjs) => lhs.isSame(rhs, 'date'),
  });
</script>

<div class="p-4 space-y-4 card">
  <h1 class="text-lg font-medium">Upcoming meetings</h1>
  <ul class="space-y-4">
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
</div>
