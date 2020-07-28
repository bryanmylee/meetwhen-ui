<script>
  import { calendarSelectionEnabled } from '../../stores';
  import createNewSelection from './actions/createNewSelection';

  import SeparatorLines from './SeparatorLines.svelte';

  // PROPS
  // =====
  export let day;
  // If this day does not sequentially follow the previous day in the calendar.
  export let skipped = false;
</script>

<div class="col" class:skipped>
  <div class="date-label">
    {day.format('ddd D')}
  </div>
  <div
    class="col__body"
    class:skipped
    use:createNewSelection={{ day, enabled: $calendarSelectionEnabled }}
    on:newSelectStart
    on:newSelectMove
    on:newSelectEnd
  >
    <SeparatorLines />
    <slot/>
  </div>
</div>

<style>
  .col {
    width: 100%;
    max-width: 50%;
    min-width: var(--col-width);
  }

  .date-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    box-sizing: border-box;
    border-bottom: 1px var(--grey-400) solid;
    background-color: var(--bg);
  }

  .col__body {
    position: relative;
    /* min-width: var(--col-width); */
    width: 100%;
    min-height: calc(var(--row-height) * 24);
    box-sizing: border-box;
    border-right: 1px var(--grey-300) solid;
    user-select: none;
  }

  .col.skipped {
    margin-left: 1rem;
  }

  .col__body.skipped {
    border-left: 1px var(--grey-300) solid;
  }
</style>