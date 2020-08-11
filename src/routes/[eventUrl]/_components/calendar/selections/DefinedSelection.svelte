<script>
  import { isCreatingNewSelection } from '../stores';
  import { sizePos } from '../actions/selection';

  // PROPS
  // =====
  export let columnStart;
  export let columnEnd;
  export let start;
  export let end;
</script>

<div
  data-defined-selection data-start-ms={+start} data-end-ms={+end}
  class="selection__container"
  class:pass-through={$isCreatingNewSelection}
  use:sizePos={{ columnStart, columnEnd, start, end, duration: 0 }}
>
  <span data-resize-defined-selection data-top data-start-ms={+start} data-end-ms={+end}/>
  <div class="selection__content pass-through"/>
  <span data-resize-defined-selection data-bottom data-start-ms={+start} data-end-ms={+end}/>
</div>

<style>
  .selection__container {
    position: absolute;
    z-index: 14;
    left: var(--select-collapse-width);
    width: calc(100% - var(--select-collapse-width));
    display: flex;
    cursor: move;
  }

  :global(.moving).selection__container {
    z-index: 15;
  }

  [data-resize-defined-selection] {
    margin: 0 0.2em;
    position: absolute;
    height: calc(var(--row-height) / 4);
    left: 0;
    right: 0;
    border-radius: 5px;
    cursor: ns-resize;
  }

  [data-resize-defined-selection]:hover {
    background-color: var(--primary-300);
  }

  [data-resize-defined-selection][data-top] {
    top: 0;
  }

  [data-resize-defined-selection][data-bottom] {
    bottom: 0;
  }

  .selection__content {
    width: 100%;
    margin: 0 0.2em;
    border-radius: 5px;
    background-color: var(--primary-400);
    transition: background-color 200ms ease;
  }

  :global(.moving) .selection__content {
    z-index: 15;
    background-color: var(--primary-300);
    box-shadow: var(--shadow-small);
  }

  :global(.deleting) .selection__content {
    z-index: 15;
    background-color: var(--error-100);
  }


  .pass-through {
    pointer-events: none;
  }
</style>