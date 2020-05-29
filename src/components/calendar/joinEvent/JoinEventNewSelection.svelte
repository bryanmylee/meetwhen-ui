<script>
  import { fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import dayjs from 'dayjs';

  import { smoothSizePos } from '../../../actions/selection.js';

  // Represents the start and end points of the user selection in this day.
  export let start;
  export let end;
</script>

<div transition:fade use:smoothSizePos={{start, end}}></div>

<style>
  div {
    position: absolute;
    left: var(--select-collapse-width);
    width: var(--select-join-width);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: var(--primary-1);
    opacity: 1;
    pointer-events: none;
  }
</style>