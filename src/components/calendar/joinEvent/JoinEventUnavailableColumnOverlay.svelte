<script>
  import { getTop, getHeight, } from '../../../utils/selections.js';
  import { getNonIntervals } from '../../../utils/intervals.js';

  export let eventIntervals;

  const nonEventIntervals = getNonIntervals(eventIntervals);
</script>

{#each nonEventIntervals as interval}
  <div
    style="top:{getTop(interval.start)};
           height:{getHeight(interval.end - interval.start)};"
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
</style>