<script>
  export let outline = false;
  export let alt = false;
  export let disabled = false;
  export let fakeDisabled = false;
  export let iconOnly = false;
  export let style = '';
</script>

<button
  {style}
  {disabled}
  on:click
  class="no-highlight"
  class:outline={outline}
  class:alt={alt}
  class:fake-disabled={fakeDisabled}
  class:icon-only={iconOnly}
  {...$$props}
>
  <slot/>
</button>

<style>
  button {
    margin: 0;
    border: 0;
    color: var(--primary-text);
    background-color: var(--primary-500);
    padding: 0.8em 1em;
    border-radius: 1.4em;
    box-sizing: border-box;
    transition: all 200ms ease;
    cursor: pointer;
    height: min-content;
  }

  button:focus, button:hover {
    background-color: var(--primary-400);
    outline: none;
    box-shadow: var(--shadow-small);
  }

  button:active {
    background-color: var(--primary-600);
    transform: scale(0.98);
    box-shadow: none;
  }

  button:disabled, button.fake-disabled {
    cursor: unset;
    box-shadow: none;
    background-color: var(--grey-400);
    transform: none;
  }

  button.icon-only {
    width: 2.8em;
    height: 2.8em;
    padding: 0.7em;
  }

  button.outline {
    color: var(--primary-500);
    background-color: unset;
    border: 1px var(--primary-500) solid;
  }

  button.outline:focus, button.outline:hover {
    color: var(--primary-400);
    border: 1px var(--primary-400) solid;
  }

  button.outline:active {
    color: var(--primary-600);
    border: 1px var(--primary-600) solid;
  }

  button.outline:disabled, button.outline.fake-disabled {
    color: var(--grey-500);
    border: 1px var(--grey-500) solid;
    box-shadow: none;
  }

  button.alt {
    color: var(--text-800);
    background-color: var(--grey-100);
  }

  button.alt:focus, button.alt:hover {
    background-color: var(--grey-50);
  }

  button.alt:active {
    background-color: var(--grey-200);
  }

  button.alt:disabled, button.outline.fake-disabled {
    color: var(--text-500);
    background-color: var(--grey-100);
  }
</style>