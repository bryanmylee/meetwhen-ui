<script>
  import { fade } from 'svelte/transition';

  import { inputAction, labelAction, barAction } from './TextInput.js';

  export let label = "Label";
  export let isPassword = false;
  export let value;

  let focused = false;
  export let required = false;
  export let attempted = false;
  $: showError = required && attempted && value.length === 0;
</script>

<div>
  <input use:inputAction={{isPassword}} bind:value={value}
    on:focus={() => focused = true}
    on:blur={() => focused = false}
  />
  <label use:labelAction={{focused, value, showError}}>
    {label}
  </label>
  <span class="bar" use:barAction={{focused, showError}}></span>
</div>

<style>
  div {
    position: relative;
    margin-top: 0.6em;
    margin-right: 2em;
    padding-bottom: 0.2em;
  }

  input {
    font-size: 1em;
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid var(--line-1);
    padding: 10px 10px 5px 5px;
    margin-bottom: 1px;
  }

  input:focus {
    outline: none;
  }

  label {
    font-size: 1em;
    color: var(--text-3);
    position: absolute;
    left: 5px;
    top: 10px;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
    pointer-events: none;
  }

  .bar {
    position: absolute;
    width: 0;
    height: 1px;
    bottom: 4px;
    background-color: var(--primary-1);
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }
</style>