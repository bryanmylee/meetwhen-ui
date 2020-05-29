<script>
  import { isSelecting } from '../../../stores.js';
  import { smoothSizePos } from '../../../actions/selection.js';

  export let start;
  export let end;
</script>

<div
  use:smoothSizePos={{start, end, duration: 0}}
  class="container"
  class:pass-through={$isSelecting}
>
  <div
    class="content"
    class:pass-through={$isSelecting}
  ></div>
</div>

<style>
  .container {
    position: absolute;
    left: var(--select-collapse-width);
    width: var(--select-join-width);
    display: flex;
  }

  .content {
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