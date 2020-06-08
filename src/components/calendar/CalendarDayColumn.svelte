<script>
  import { getContext } from 'svelte';

  import { top } from '../../actions/dayColumn.js';
  import { isSelecting } from '../../stores.js';

  // PROPS
  // =====
  export let day;
</script>

<div class="day-col">
  <!-- DATE LABEL -->
  <div class="date-label">
    {day.format('ddd D')}
  </div>
  <div class="column">
    <!-- SEPARATOR LINES -->
    <div class="hour-separators">
      {#each Array(24) as _, inc}
        <div
          class="hour-separators__separator"
          use:top={{hour: inc + 1}}
        ></div>
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
    border-bottom: 1px var(--line-1) solid;
    background-color: white;
  }

  .column {
    position: relative;
    min-width: var(--col-width);
    max-width: var(--col-width);
    min-height: calc(var(--row-height) * 24);
    box-sizing: border-box;
    border-right: 1px var(--line-1) solid;
    user-select: none;
  }

  .hour-separators {
    pointer-events: none;
    touch-action: none;
  }

  .hour-separators__separator {
    width: 100%;
    height: 1px;
    background-color: var(--line-2);
  }
</style>