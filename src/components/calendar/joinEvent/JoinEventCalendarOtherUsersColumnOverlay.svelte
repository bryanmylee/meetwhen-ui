<script>
  import JoinEventCalendarOtherUsersSelection
      from './JoinEventCalendarOtherUsersSelection.svelte';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }[]
   */
  export let mergedIntervals = [];
  export let maxUsernames = 0;
</script>

{#each mergedIntervals as interval}
  <JoinEventCalendarOtherUsersSelection
    {interval}
    {maxUsernames}
  />
{/each}