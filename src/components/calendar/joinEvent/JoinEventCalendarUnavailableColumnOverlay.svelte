<script>
  import {
    getTop, getHeight,
    getNonSelections,
  } from '../../../utils/selections.js';

  export let eventIntervals;

  const nonEventIntervals = getNonSelections(eventIntervals);
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
    background-color: var(--line-1);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: all;
  }
</style>