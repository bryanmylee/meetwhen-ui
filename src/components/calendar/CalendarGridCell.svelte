<script>
  import { gridCellMouse } from './CalendarGridCell.js';

  export let day;
  export let hour;
  export let snap = 0.25;
</script>

<div
  class="cell"
  use:gridCellMouse={{day, hour, snap}}
  on:mouseSelectStart on:mouseSelectMove on:mouseSelectStop
>
</div>

<style>
  div {
    min-width: var(--col-width);
    min-height: var(--row-height);
    box-sizing: border-box;
    border-bottom: 1px var(--line-2) solid;
    border-right: 1px var(--line-1) solid;
  }
</style>