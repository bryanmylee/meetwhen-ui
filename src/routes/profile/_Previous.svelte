<script lang="ts">
  import MeetingItem from './_MeetingItem.svelte';
  import { entriesById } from '$lib/utils/entries-by-id';
  import type { ShallowMeeting } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';
  import StyledAccordian from '$lib/components/StyledAccordian.svelte';

  export let previousMeetings: ShallowMeeting[];
  $: groupedEntries = entriesById(previousMeetings, {
    getKey: (item) => item.total.beg,
    keyEqual: (lhs: Dayjs, rhs: Dayjs) => lhs.isSame(rhs, 'date'),
  });
</script>

<section>
  <StyledAccordian>
    <h1 slot="title" class="text-xl font-medium">Previous meetings</h1>
    <ul>
      {#each groupedEntries as [date, meetings]}
        <li class="flex space-x-4">
          <div class="py-2 w-[6ch] text-right">
            {date.format('DD MMM')}
          </div>
          <ul class="flex-1 space-y-4">
            {#each meetings as meeting}
              <MeetingItem {meeting} />
            {/each}
          </ul>
        </li>
      {:else}
        No previous meetings...
      {/each}
    </ul>
  </StyledAccordian>
</section>
