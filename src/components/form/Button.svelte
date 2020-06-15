<script>
  export let outline = false;
  export let alt = false;
</script>

<button
  on:click
  class="no-highlight"
  class:outline={outline}
  class:alt={alt}
>
  <slot/>
</button>

<style>
  button {
    margin: 0;
    border: 0;
    color: white;
    background-color: var(--primary-1);
    padding: 0.8em 1em;
    border-radius: 1.4em;
    box-sizing: border-box;
    transition: all 200ms ease;
  }

  button:focus, button:hover {
    background-color: var(--primary-1-1);
    outline: none;
    box-shadow: var(--shadow-small);
  }

  button:active {
    background-color: var(--text-3);
    transform: scale(0.98);
    transition: none;
  }

  .outline {
    color: var(--primary-1);
    background-color: unset;
    border: 1px var(--primary-1) solid;
  }

  .outline:focus, .outline:hover {
    color: var(--primary-1-1);
    background-color: white;
    border: 1px var(--primary-1-1) solid;
  }

  .alt {
    color: var(--text-2);
    background-color: unset;
    border: 1px var(--line-1) solid;
  }

  .alt:focus, .alt:hover {
    background-color: white;
    border: 1px transparent solid;
  }
</style>