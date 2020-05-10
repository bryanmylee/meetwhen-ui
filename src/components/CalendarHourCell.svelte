<script>
  import { createEventDispatcher } from 'svelte';

  export let start;
  export let quarterHourThreshold = true;

  let cell;
  const dispatch = createEventDispatcher();

  function handleMousedown(e) {
    // Cross-browser calculation of offsetY by Jack Moore, 2012.
    // https://www.jacklmoore.com/notes/mouse-position/
    // e.offsetY breaks on Safari when zooming the canvas in.
    const { target } = e;
    const rect = target.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    let minutes = offsetY / cell.offsetHeight * 60;
    if (quarterHourThreshold) {
      minutes = Math.floor(minutes / 15) * 15;
    }
    dispatch('mousedown', {
      datetime: start.add(minutes, 'minute'),
    })
  }
</script>

<div
  class="cell main-area__bg-cell"
  on:mousedown={handleMousedown}
  bind:this={cell}
>
</div>