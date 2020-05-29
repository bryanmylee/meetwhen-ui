<script>
  import { smoothSizePos } from '../../../actions/selection.js';

  // Represents the start points of the user selection in this day.
  export let start;
  export let end;
</script>

<div
  use:smoothSizePos={{start, end}}
  class="container"
>
  <div class="content"></div>
</div>

<style>
  .container {
    position: absolute;
    width: var(--select-width);
    display: flex;
    pointer-events: none;
  }

  .content {
    width: 100%;
    margin: 0 0.2em;
    border-radius: 5px;
    background-color: var(--primary-1);
    box-shadow: var(--shadow-med);
  }
</style>