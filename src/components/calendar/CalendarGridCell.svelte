<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { getMouseOffset } from '../../utils/mouseEventHandler.js';

  export let day;
  export let hour;
  export let snapTo = 0.25;

  let cell;
  function getRatioY(offsetY) {
    const ratioY = offsetY / cell.offsetHeight;
    return Math.floor(ratioY / snapTo) * snapTo;
  }

  function startSelection(event) {
    const { offsetY } = getMouseOffset(event);
    const ratioY = getRatioY(offsetY);
    if (event.buttons === 1) {
      dispatch('startSelection', {
        day,
        hour: hour + ratioY,
      });
    }
  }

  function move(event) {
    const { offsetY } = getMouseOffset(event);
    const ratioY = getRatioY(offsetY);
    if (event.buttons === 1) {
      dispatch('gridDrag', {
        day,
        hour: hour + ratioY,
      });
    }
  }

  function stopSelection() {
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