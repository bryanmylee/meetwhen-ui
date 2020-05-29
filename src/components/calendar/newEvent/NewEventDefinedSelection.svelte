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
    width: var(--select-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>