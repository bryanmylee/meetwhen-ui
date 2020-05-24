<script>
  import JoinEventOtherUsersSelection from './JoinEventOtherUsersSelection.svelte';
  /*
   * { start: Dayjs, end: Dayjs, usernames: string[] }[]
   */
  export let mergedIntervals = [];
  export let maxUsernames = 0;
</script>

{#each mergedIntervals as interval}
  <JoinEventOtherUsersSelection
    {interval}
    {maxUsernames}
  />
{/each}