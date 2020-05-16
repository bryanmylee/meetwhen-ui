<script>
  import NewEventCalendarDefinedSelection
      from './NewEventCalendarDefinedSelection.svelte';
  import NewEventCalendarNewSelection
      from './NewEventCalendarNewSelection.svelte';

  export let selections;
  export let newSelection;
</script>

<div>
  {#each selections as selection}
    <NewEventCalendarDefinedSelection {...selection} />
  {/each}
  {#if newSelection && newSelection.start && newSelection.end}
    <NewEventCalendarNewSelection {...newSelection} />
  {/if}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>