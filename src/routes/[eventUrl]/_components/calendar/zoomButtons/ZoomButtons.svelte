<script>
  import { Button } from 'src/components/form';
  import ZoomIn from 'src/components/icons/ZoomIn.svelte';
  import ZoomOut from 'src/components/icons/ZoomOut.svelte';

  // BINDINGS
  // ========
  export let size = 16;
</script>

<div>
  <Button alt iconOnly on:click={() => size = Math.min(32, size + 4)}>
    <ZoomIn color="var(--text-700)" />
  </Button>
  <Button alt iconOnly on:click={() => size = Math.max(4, size - 4)} style="margin-left: 1em;">
    <ZoomOut color="var(--text-700)" />
  </Button>
</div>

<style>
  div {
    position: absolute;
    right: 1em;
    bottom: 1em;
    display: flex;
    justify-content: flex-end;
    z-index: 20;
    padding: 1em;
    pointer-events: none;
  }

  div :global(button) {
    pointer-events: all;
  }
</style>

