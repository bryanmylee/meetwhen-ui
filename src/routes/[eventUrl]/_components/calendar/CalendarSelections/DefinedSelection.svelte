<script>
  import { getContext } from 'svelte';
  import { isSelecting, dragDropState } from '../stores';
  import { sizePos } from '../actions/selection';
  import moveAndResizable from '../actions/moveAndResizable';

  const {
    deleteSelection,
    moveSelection,
    resizeSelectionTop,
    resizeSelectionBottom,
  } = getContext('dragresize');

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
  use:sizePos={{ start, end, duration: 0 }}
  use:moveAndResizable={{ start, end }}
  on:updateState={({ detail }) => {
    state = detail.state;
    $dragDropState = detail.state;
  }}
  on:deleteSelection={deleteSelection}
  on:moveSelection={moveSelection}
  on:resizeSelectionTop={resizeSelectionTop}
  on:resizeSelectionBottom={resizeSelectionBottom}
>
  <div
    class="selection__content pass-through"
    class:move-resizing={state !== 'NONE'}
  />
</div>

<style>
  .selection__container {
    position: absolute;
    z-index: 14;
    left: var(--select-collapse-width);
    width: calc(100% - var(--select-collapse-width));
    display: flex;
  }

  .move-resizing {
    box-shadow: var(--shadow-med);
  }

  .selection__content {
    width: 100%;
    margin: 0 0.2em;
    border-radius: 5px;
    background-color: var(--primary-400);
    pointer-events: all;
  }

  .pass-through {
    pointer-events: none;
  }
</style>