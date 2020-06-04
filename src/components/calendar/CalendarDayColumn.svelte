<script>
  import { getContext } from 'svelte';

  import { top } from '../../actions/column.js';
  import { isSelecting } from '../../stores.js';

  export let day;
</script>

<div class="no-highlight">
  <div class="date-label">
    {day.format('ddd D')}
  </div>
  <div class="column">
    <!-- Render separator lines -->
    {#each Array(24) as _, inc}
      <div
        class="hour-separator"
        use:top={{hour: inc + 1}}
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
    min-height: calc(var(--row-height) * 24);
    box-sizing: border-box;
    border-right: 1px var(--line-1) solid;
    user-select: none;
  }

  .hour-separator {
    width: 100%;
    height: 1px;
    background-color: var(--line-2);
    pointer-events: none;
    touch-action: none;
  }
</style>