<script>
  import JoinEventCalendarOtherUserSelection
      from './JoinEventCalendarOtherUserSelection.svelte';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }[]
   */
  export let mergedIntervals = [];
  export let maxUsernames = 0;
</script>

{#each mergedIntervals as interval}
  <JoinEventCalendarOtherUserSelection
    {interval}
    {maxUsernames}
  />
{/each}