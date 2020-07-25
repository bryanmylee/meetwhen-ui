<script>
  import { smoothSizePos } from 'src/components/calendar/actions/selection';

  // PROPS
  // =====
  export let start;
  export let end;
</script>

<div
  use:smoothSizePos={{ start, end }}
  class="selection__container"
>
  <div class="selection__content" />
</div>

<style>
  .selection__container {
    position: absolute;
    z-index: 11;
    left: var(--select-collapse-width);
    width: var(--select-join-width);
    display: flex;
    pointer-events: none;
  }

  .selection__content {
    width: 100%;
    margin: 0 0.2em;
    border-radius: 5px;
    background-color: var(--primary-300);
    box-shadow: var(--shadow-med);
  }
</style>