<script>
  import { createEventDispatcher } from 'svelte';

  import { getMouseOffset } from '../utils/MouseEventHandler.js';

  export let start;
  export let quarterHourThreshold = true;

  let cell;
  const dispatch = createEventDispatcher();

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
    dispatch('startSelection', {
      datetime: start.add(minutes, 'minute'),
    });
  }

  function stopSelection(e) {
    const { offsetY } = getMouseOffset(e);
    const minutes = getMinutes(offsetY);
    dispatch('stopSelection', {
      datetime: start.add(minutes, 'minute'),
    });
  }

  function move(e) {
    const { offsetY } = getMouseOffset(e);
    const minutes = getMinutes(offsetY);
    if (e.buttons === 1) {
      dispatch('drag', {
        datetime: start.add(minutes, 'minute'),
      });
    }
  }
</script>

<div
  class="cell main-area__bg-cell"
  on:mousedown={startSelection}
  on:mouseup={stopSelection}
  on:mousemove={move}
  bind:this={cell}
>
</div>