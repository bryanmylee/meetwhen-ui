<script>
  import ColumnTargets from './ColumnTargets.svelte';

  // PROPS
  // =====
  // If this day does not sequentially follow the previous day in the calendar.
  export let skipped = false;
  export let start;
  export let end;
</script>

<div class="col" class:skipped>
  <div class="date-label">
    {start.format('ddd D')}
  </div>
  <div
    class="col__body"
    class:skipped
  >
    <ColumnTargets {start} {end} />
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
    position: sticky;
    top: -1px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5em;
    border-bottom: 1px var(--grey-400) solid;
    background-color: var(--bg);
  }

  .col__body {
    position: relative;
    width: 100%;
    margin-top: 1rem;
    border-right: 1px var(--grey-300) solid;
    user-select: none;
  }

  .col.skipped {
    margin-left: 1em;
  }

  .col__body.skipped {
    border-left: 1px var(--grey-300) solid;
  }
</style>