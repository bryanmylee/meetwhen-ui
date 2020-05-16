<script>
  import JoinEventCalendarDisabledInterval
      from './JoinEventCalendarDisabledInterval.svelte';
  
  export let eventIntervalsByDay = {};
</script>

<div>
  {#each Object.values(eventIntervalsByDay) as intervalsInDay, columnIndex}
    {#each intervalsInDay as interval}
      <JoinEventCalendarDisabledInterval {...interval} {columnIndex} />
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