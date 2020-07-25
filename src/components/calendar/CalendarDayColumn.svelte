<script>
  // PROPS
  // =====
  export let day;
  // If this day does not sequentially follow the previous day in the calendar.
  export let skipped = false;
</script>

<div class="col">
  <!-- DATE LABEL -->
  <div class="date-label" class:skipped-day={skipped} >
    {day.format('ddd D')}
  </div>
  <div class="col__body" class:skipped-day={skipped} >
    <!-- SEPARATOR LINES -->
    <div class="col__separators">
      {#each Array(24) as _, inc}
        <div
          class="separators"
          style={`top: calc(var(--row-height) * ${inc})`}
        />
      {/each}
    </div>
    <!-- RENDERED INTERVALS/SELECTIONS -->
    <slot />
  </div>
</div>

<style>
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
    min-width: var(--col-width);
    max-width: var(--col-width);
    min-height: calc(var(--row-height) * 24);
    box-sizing: border-box;
    border-right: 1px var(--grey-300) solid;
    user-select: none;
  }

  .skipped-day {
    margin-left: 1rem;
  }

  .col__body.skipped-day {
    border-left: 1px var(--grey-300) solid;
  }

  .col__separators {
    pointer-events: none;
    touch-action: none;
  }

  .separators {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: var(--grey-200);
  }
</style>