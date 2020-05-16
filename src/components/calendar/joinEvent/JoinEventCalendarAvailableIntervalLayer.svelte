<script>
  import JoinEventCalendarAvailableInterval
      from './JoinEventCalendarAvailableInterval.svelte';
  
  export let eventIntervalsByDay = {};
</script>

<div>
  {#each Object.values(eventIntervalsByDay) as intervalsInDay, columnIndex}
    {#each intervalsInDay as interval}
      <JoinEventCalendarAvailableInterval {...interval} {columnIndex} />
    {/each}
  {/each}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>