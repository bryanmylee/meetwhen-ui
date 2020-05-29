<script>
  import { isSelecting } from '../../../stores.js';
  import { getNonIntervals } from '../../../utils/interval.js';
  import { sizePos } from '../../../actions/selection.js';

  export let eventIntervals;

  const nonEventIntervals = getNonIntervals(eventIntervals);
</script>

{#each nonEventIntervals as interval}
  <div
    use:sizePos={{start: interval.start, end: interval.end}}
    class:pass-through={$isSelecting}
  ></div>
{/each}

<style>
  div {
    position: absolute;
    width: var(--col-width);
    background-color: var(--line-2);
    opacity: 0.5;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>