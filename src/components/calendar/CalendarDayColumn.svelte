<script>
  import { getContext } from 'svelte';
  const { mouseSelectStart, mouseSelectMove, mouseSelectStop } = getContext('select');
  import { gridColumnMouse, hourSeparator } from './CalendarDayColumn.js';

  export let day;
  export let snapToHour = 0.25;
</script>

<div class="no-highlight">
  <div class="date-label">
    {day.format('ddd D')}
  </div>
  <div class="column">
    <!-- Render selection area div -->
    <div
      class="select-area"
      use:gridColumnMouse={{day, snapToHour}}
      on:mouseSelectStart={mouseSelectStart}
      on:mouseSelectMove={mouseSelectMove}
      on:mouseSelectStop={mouseSelectStop}
    ></div>
    <!-- Render separator lines -->
    {#each Array(24) as _, inc}
      <div
        class="hour-separator"
        use:hourSeparator={{hour: inc + 1}}
      ></div>
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

  .column {
    position: relative;
    min-width: var(--col-width);
    min-height: calc(var(--row-height) * 24);
    box-sizing: border-box;
    border-right: 1px var(--line-1) solid;
    user-select: none;
  }

  .select-area {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .hour-separator {
    width: 100%;
    height: 1px;
    background-color: var(--line-2);
  }
</style>