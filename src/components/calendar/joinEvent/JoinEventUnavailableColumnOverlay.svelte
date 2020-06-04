<script>
  import { isSelecting } from '../../../stores.js';
  import { getNonIntervals } from '../../../utils/interval.js';
  import { sizePos } from '../../../actions/column.js';

  export let eventIntervals;

  const nonEventIntervals = getNonIntervals(eventIntervals);
</script>

{#each nonEventIntervals as { start, end }}
  <div
    use:sizePos={{start, end}}
    class:pass-through={$isSelecting}
  ></div>
{/each}

<style>
  div {
    position: absolute;
    width: var(--col-width);
    background-color: var(--disabled-shade);
    opacity: 0.5;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>