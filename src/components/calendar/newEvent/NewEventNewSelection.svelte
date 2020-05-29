<script>
  import dayjs from 'dayjs';

  import { smoothSizePos } from '../../../actions/selection.js';

  // Represents the start points of the user selection in this day.
  export let start;
  export let end;
</script>

<div use:smoothSizePos={{start, end}}></div>

<style>
  div {
    position: absolute;
    width: var(--select-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 1;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: none;
  }
</style>