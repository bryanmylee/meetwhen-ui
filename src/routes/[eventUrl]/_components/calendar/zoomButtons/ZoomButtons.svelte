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
    <ZoomIn color="var(--text-700)" />
  </Button>
  <Button alt iconOnly on:click={() => size = Math.max(8, size - 1)} style="margin-left: 1em;">
    <ZoomOut color="var(--text-700)" />
  </Button>
</div>

<style>
  div {
    position: absolute;
    right: 2em;
    bottom: 2em;
    display: flex;
    justify-content: flex-end;
    z-index: 20;
    pointer-events: none;
  }

  div :global(button) {
    pointer-events: all;
  }
</style>

