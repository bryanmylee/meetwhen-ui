<script>
  import { createEventDispatcher } from 'svelte';

  export let start;
  export let quarterHourThreshold = true;

  let cell;
  const dispatch = createEventDispatcher();

  function handleMousedown(e) {
    let minutes = e.offsetY / cell.offsetHeight * 60;
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