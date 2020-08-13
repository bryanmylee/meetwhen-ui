<script>
  import Add from 'src/components/icons/Add.svelte';
  import Remove from 'src/components/icons/Remove.svelte';

  // BINDINGS
  // ========
  export let scale = 1;
</script>

<div>
  <button
    on:click={() => scale = Math.min(2, scale + 0.25)}
  >
    <Add color="var(--text-800)" />
  </button>
  <button alt iconOnly
    on:click={() => scale = Math.max(0.25, scale - 0.25)}
    style="margin-left: 1em;"
  >
    <Remove color="var(--text-800)" />
  </button>
</div>

<style>
  div {
    position: absolute;
    right: 0.5em;
    bottom: 0.5em;
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
    touch-action: manipulation;
  }

  button:focus, button:hover {
    background-color: var(--grey-200);
  }

  button:active {
    background-color: var(--grey-400);
    box-shadow: none;
  }
</style>

