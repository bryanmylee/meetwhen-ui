<script>
  export let outline = false;
  export let alt = false;
  export let disabled = false;
  export let style = '';
</script>

<button
  {style}
  {disabled}
  on:click
  class="no-highlight"
  class:outline={outline}
  class:alt={alt}
  {...$$props}
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
    background-color: var(--line-1);
    transform: scale(0.98);
    box-shadow: none;
  }

  button:disabled,
  button:disabled:focus,
  button:disabled:hover,
  button:disabled:active {
    background-color: var(--line-1);
    transform: scale(0.98);
    box-shadow: none;
  }

  .outline {
    color: var(--primary-1);
    background-color: unset;
    border: 1px var(--primary-1) solid;
  }

  .outline:focus, .outline:hover, .outline:active {
    color: var(--primary-1-1);
    background-color: white;
    border: 1px var(--primary-1-1) solid;
  }

  button.outline:disabled,
  button.outline:disabled:focus,
  button.outline:disabled:hover,
  button.outline:disabled:active,
  button.alt:disabled,
  button.alt:disabled:focus,
  button.alt:disabled:hover,
  button.alt:disabled:active {
    color: var(--text-3);
    background-color: unset;
    border: 1px var(--line-1) solid;
    transform: scale(0.98);
    box-shadow: none;
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

  .alt:active {
    border: 1px var(--line-1) solid;
  }
</style>