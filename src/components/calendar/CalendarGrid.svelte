<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import CalendarGridCell from './CalendarGridCell.svelte';

  export let days;
  export let hours;

  function mouseLeave(e) {
    if (e.buttons === 1) {
      dispatch('stopSelection');
    }
  }
</script>

<div on:mouseleave={mouseLeave}>
  {#each days as day}
    {#each hours as hour}
      <CalendarGridCell start={day.hour(hour.hour())}
        on:startSelection on:gridDrag on:stopSelection
      />
    {/each}
  {/each}
</div>

<style>
  div {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(24, var(--row-height));
    grid-auto-columns: var(--col-width);
  }
</style>