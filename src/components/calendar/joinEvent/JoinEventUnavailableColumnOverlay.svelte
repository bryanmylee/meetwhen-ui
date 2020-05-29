<script>
  import { isSelecting } from '../../../stores.js';
  import { getTop, getHeight, } from '../../../utils/selection.js';
  import { getNonIntervals } from '../../../utils/interval.js';

  export let eventIntervals;

  const nonEventIntervals = getNonIntervals(eventIntervals);
</script>

{#each nonEventIntervals as interval}
  <div
    style="top:{getTop(interval.start)};
           height:{getHeight(interval.end - interval.start)};"
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