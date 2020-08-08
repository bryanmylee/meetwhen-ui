<script>
  import Close from 'src/components/icons/Close.svelte';
</script>

<button on:click>
  <Close color="var(--text-900)"/>
</button>

<style>
  button {
    width: 1em;
    height: 1em;
    margin: 0.5em;
    padding: 0.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 500px;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  button:hover, button:focus {
    background-color: var(--grey-200);
  }

  button:active {
    background-color: var(--grey-300);
  }
</style>