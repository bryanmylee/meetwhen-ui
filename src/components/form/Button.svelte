<button on:click class="no-highlight"><slot /></button>

<style>
  button {
    border: 0;
    color: white;
    background-color: var(--primary-1);
    transition: 0.2s ease opacity, 0.2s ease background-color;
    padding: 1em;
    margin: 0;
    border-radius: 5px;
  }

  button:focus, button:hover {
    background-color: var(--primary-1-1);
    outline: none;
    box-shadow: var(--box-shadow);
  }

  button:active {
    background-color: var(--text-3);
    transform: scale(0.98);
    transition: none;
  }
</style>