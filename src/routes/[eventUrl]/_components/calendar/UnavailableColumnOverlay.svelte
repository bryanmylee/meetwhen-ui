<script>
  import { isSelecting } from './stores.js';
  import { getNonIntervals } from 'src/utils/interval.js';
  import { sizePos } from 'src/actions/dayColumn.js';

  // PROPS
  // =====
  export let eventIntervals;

  // ATTRIBUTES
  // ==========
  const nonEventIntervals = getNonIntervals(eventIntervals);
</script>

{#each nonEventIntervals as { start, end }}
  <div
    use:sizePos={{start, end}}
    class:pass-through={$isSelecting}
  />
{/each}

<style>
  div {
    position: absolute;
    z-index: 19;
    width: var(--col-width);
    background-color: var(--disabled-shade);
    opacity: 0.5;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>