<script>
  import { getContext } from 'svelte';
  import { isSelecting } from './stores.js';
  import { sizePos, moveAndResizable } from 'src/components/calendar/actions/selection.js';

  const { moveSelection } = getContext('dragresize');

  // PROPS
  // =====
  export let start;
  export let end;

  // STATE
  // =====
  let state = 'NONE';
</script>

<div
  class="selection__container"
  class:pass-through={$isSelecting}
  use:sizePos={{start, end, duration: 0}}
  use:moveAndResizable={{start, end}}
  on:updateState={({ detail }) => state = detail.state}
  on:moveSelection={moveSelection}
>
  <div
    class="selection__content pass-through"
    class:move-resizing={state !== 'NONE'}
  />
</div>

<style>
  .selection__container {
    position: absolute;
    z-index: 10;
    left: var(--select-collapse-width);
    width: var(--select-join-width);
    display: flex;
  }

  .move-resizing {
    box-shadow: var(--shadow-med);
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