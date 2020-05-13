<script>
  import BackgroundGrid from './BackgroundGrid.svelte';
  import GridSelectionLayer from './GridSelectionLayer.svelte';

  export let days;
  export let hours;
  export let selections;
  export let activeSelection;
</script>

<div>
  <BackgroundGrid {days} {hours}
    on:startSelection on:gridDrag on:stopSelection
  />
  <GridSelectionLayer {selections} {activeSelection}/>
</div>

<style>
  div {
    position: relative;
  }
</style>