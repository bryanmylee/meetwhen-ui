<script>
  import { isSelecting } from './stores';
  import { getNonIntervals } from 'src/utils/interval';
  import { sizePos } from './actions/selection';

  // PROPS
  // =====
  export let eventIntervals;

  // ATTRIBUTES
  // ==========
  const nonEventIntervals = getNonIntervals(eventIntervals);
</script>

{#each nonEventIntervals as { start, end }}
  <div
    use:sizePos={{ start, end }}
    class:pass-through={$isSelecting}
  />
{/each}

<style>
  div {
    position: absolute;
    z-index: 10;
    width: 100%;
    background-color: var(--grey-200);
    opacity: 0.5;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>