<script>
  import { isSelecting } from './stores.js';
  import { smoothSizePos } from '@/actions/dayColumn.js';

  // PROPS
  // =====
  export let start;
  export let end;
</script>

<div
  use:smoothSizePos={{start, end, duration: 0}}
  class="selection__container"
  class:pass-through={$isSelecting}
>
  <div
    class="selection__content"
    class:pass-through={$isSelecting}
  />
</div>

<style>
  .selection__container {
    position: absolute;
    z-index: 10;
    width: var(--select-width);
    display: flex;
  }

  .selection__content {
    width: 100%;
    margin: 0 0.2em;
    border-radius: 5px;
    background-color: var(--primary-1);
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>