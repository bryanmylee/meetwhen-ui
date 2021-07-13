<script lang="ts">
  import MeetingItem from './_MeetingItem.svelte';
  import type { ShallowMeeting } from '$lib/gql/types';

  export let upcomingMeetings: ShallowMeeting[] = [];
</script>

<div class="p-4 space-y-4 card">
  <h1 class="text-lg font-medium">Upcoming meetings</h1>
  <ul class="space-y-4">
    {#each upcomingMeetings as meeting}
      <MeetingItem {meeting} />
    {:else}
      No upcoming meetings...
    {/each}
  </ul>
</div>
