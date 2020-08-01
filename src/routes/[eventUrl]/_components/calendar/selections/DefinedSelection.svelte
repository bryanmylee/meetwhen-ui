<script>
  import { isCreatingNewSelection } from '../stores';
  import { sizePos } from '../actions/selection';

  // PROPS
  // =====
  export let start;
  export let end;
</script>

<div
  data-defined-selection data-start-ms={+start} data-end-ms={+end}
  class="selection__container"
  class:pass-through={$isCreatingNewSelection}
  use:sizePos={{ start, end, duration: 0 }}
>
  <div class="selection__content pass-through"/>
</div>

<style>
  .selection__container {
    position: absolute;
    z-index: 14;
    left: var(--select-collapse-width);
    width: calc(100% - var(--select-collapse-width));
    display: flex;
  }

  :global(.moving) {
    pointer-events: none;
  }

  :global(.moving) .selection__content {
    background-color: var(--primary-300);
    box-shadow: var(--shadow-med);
  }

  .selection__content {
    width: 100%;
    margin: 0 0.2em;
    border-radius: 5px;
    background-color: var(--primary-400);
  }

  .pass-through {
    pointer-events: none;
  }
</style>