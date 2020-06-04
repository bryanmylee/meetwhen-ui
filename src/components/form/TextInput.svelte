<script>
  import { fade } from 'svelte/transition';

  import { inputAction, labelAction } from './TextInput.js';

  export let label = "Label";
  export let isPassword = false;
  export let value;

  let focused = false;
  export let required = false;
  export let attempted = false;
  $: showError = required && attempted && value.trim().length === 0;
</script>

<div>
  <input use:inputAction={{isPassword, focused, value, showError}} bind:value={value}
    on:focus={() => focused = true}
    on:blur={() => focused = false}
  />
  <label use:labelAction={{focused, value, showError}}>
    {label}
  </label>
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
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-bottom: 1px solid var(--primary-1);
  }

  label {
    font-size: 1em;
    color: var(--text-3);
    position: absolute;
    left: 5px;
    top: 10px;
    pointer-events: none;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }
</style>