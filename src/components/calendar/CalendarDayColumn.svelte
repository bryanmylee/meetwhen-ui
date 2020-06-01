<script>
  import { getContext } from 'svelte';

  const { mouseSelectStart, mouseSelectMove, mouseSelectStop } = getContext('select');

  import CalendarGridCell from './CalendarGridCell.svelte';

  export let day;
  export let hours = [];
</script>

<div class="no-highlight">
  <div class="date-label">
    {day.format('ddd D')}
  </div>
  <div class="select-area">
    {#each hours as hour, index}
      <CalendarGridCell {day} hour={index}
        on:mouseSelectStart={mouseSelectStart}
        on:mouseSelectMove={mouseSelectMove}
        on:mouseSelectStop={mouseSelectStop}
      />
    {/each}
    <!-- Slot for selections -->
    <slot />
  </div>
</div>

<style>
  .date-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    /* min-height: var(--header-row-height); */
    padding: 0.5rem;
    box-sizing: border-box;
    border-bottom: 1px var(--line-1) solid;
    background-color: white;
  }

  .select-area {
    position: relative;
    user-select: none;
  }
</style>