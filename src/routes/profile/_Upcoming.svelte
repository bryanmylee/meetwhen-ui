<script lang="ts">
  import MeetingItem from './_MeetingItem.svelte';
  import type { ShallowMeeting } from '$lib/gql/types';

  export let upcomingMeetings: ShallowMeeting[] = [];
</script>

<div class="p-4 space-y-4 card">
  <h1 class="text-lg font-medium">Upcoming meetings</h1>
  {#if upcomingMeetings.length > 0}
    <ul class="space-y-4">
      {#each upcomingMeetings as meeting}
        <MeetingItem {meeting} />
      {/each}
    </ul>
  {/if}
</div>
