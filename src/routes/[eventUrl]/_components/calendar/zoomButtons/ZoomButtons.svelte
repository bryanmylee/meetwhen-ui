<script>
  import { Button } from 'src/components/form';
  import ZoomIn from 'src/components/icons/ZoomIn.svelte';
  import ZoomOut from 'src/components/icons/ZoomOut.svelte';

  // BINDINGS
  // ========
  export let size = 16;
</script>

<div>
  <Button alt iconOnly on:click={() => size = Math.min(32, size + 1)}>
    <ZoomIn/>
  </Button>
  <Button alt iconOnly on:click={() => size = Math.max(8, size - 1)} style="margin-left: 1em;">
    <ZoomOut/>
  </Button>
</div>

<style>
  div {
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    z-index: 20;
  }
</style>

