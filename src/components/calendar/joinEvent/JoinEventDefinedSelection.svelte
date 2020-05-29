<script>
  import { isSelecting } from '../../../stores.js';
  import { smoothSizePos } from '../../../actions/selection.js';

  export let start;
  export let end;
</script>

<div
  use:smoothSizePos={{start, end, duration: 0}}
  class:pass-through={$isSelecting}
></div>

<style>
  div {
    position: absolute;
    left: var(--select-collapse-width);
    width: var(--select-join-width);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: var(--primary-1);
    opacity: 0.5;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>