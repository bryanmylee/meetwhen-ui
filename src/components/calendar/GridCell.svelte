<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { getMouseOffset } from '../../utils/mouseEventHandler.js';

  export let start;
  export let quarterHourThreshold = true;

  let cell;
  function getMinutes(offsetY) {
    const minutes = offsetY / cell.offsetHeight * 60;
    if (quarterHourThreshold) {
      return Math.floor(minutes / 15) * 15;
    }
    return minutes;
  }

  function startSelection(e) {
    const { offsetY } = getMouseOffset(e);
    const minutes = getMinutes(offsetY);
    if (e.buttons === 1) {
      dispatch('startSelection', {
        datetime: start.add(minutes, 'minute'),
      });
    }
  }

  function move(e) {
    const { offsetY } = getMouseOffset(e);
    const minutes = getMinutes(offsetY);
    if (e.buttons === 1) {
      dispatch('gridDrag', {
        datetime: start.add(minutes, 'minute'),
      });
    }
  }

  function stopSelection(e) {
    dispatch('stopSelection');
  }
</script>

<div
  class="cell"
  on:mousedown={startSelection}
  on:mousemove={move}
  on:mouseup={stopSelection}
  bind:this={cell}
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