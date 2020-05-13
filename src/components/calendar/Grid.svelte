<script>
  import BackgroundGrid from './BackgroundGrid.svelte';
  import SelectionsLayer from './SelectionsLayer.svelte';

  export let days;
  export let hours;
  export let selections;
  export let newSelection;
</script>

<div>
  <BackgroundGrid {days} {hours}
    on:startSelection on:gridDrag on:stopSelection
  />
  <SelectionsLayer {selections} {newSelection} />
</div>

<style>
  div {
    position: relative;
  }
</style>