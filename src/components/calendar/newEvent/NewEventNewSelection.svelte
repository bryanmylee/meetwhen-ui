<script>
  import { fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';

  import { smoothSizePos } from '../../../actions/selection.js';

  // Represents the start points of the user selection in this day.
  export let start;
  export let end;
</script>

<div transition:fade use:smoothSizePos={{start, end}}></div>

<style>
  div {
    position: absolute;
    width: var(--col-width);
    border-radius: 5px;
    background-color: var(--primary-1);
    opacity: 1;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: none;
  }
</style>