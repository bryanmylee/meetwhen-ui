<script>
  import ZoomIn from 'src/components/icons/ZoomIn.svelte';
  import ZoomOut from 'src/components/icons/ZoomOut.svelte';

  // BINDINGS
  // ========
  export let size = 16;
</script>

<div>
  <button
    on:click={() => size = Math.min(32, size + 4)}
  >
    <ZoomIn color="var(--text-800)" />
  </button>
  <button alt iconOnly
    on:click={() => size = Math.max(4, size - 4)}
    style="margin-left: 1em;"
  >
    <ZoomOut color="var(--text-800)" />
  </button>
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

  button {
    width: 2.8em;
    height: 2.8em;
    padding: 0.7em;
    border: none;
    border-radius: 500px;
    outline: none;
    background-color: var(--bg);
    box-shadow: var(--shadow-small);
    cursor: pointer;
    transition: background-color 200ms ease;
  }

  button:focus, button:hover {
    background-color: var(--grey-200);
  }

  button:active {
    background-color: var(--grey-400);
    box-shadow: none;
  }
</style>

