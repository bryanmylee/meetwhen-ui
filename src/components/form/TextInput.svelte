<script>
  import { inputAction, labelAction } from './TextInput.js';

  // BINDINGS
  // ========
  export let value;

  // PROPS
  // =====
  export let label = "Label";
  export let isPassword = false;
  export let required = false;
  export let attempted = false;
  export let tip = '';

  // STATE
  // =====
  let focused = false;

  // REACTIVE ATTRIBUTES
  // ===================
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
  {#if tip && tip.trim().length !== 0}
    <h5 class="tip">{tip}</h5>
  {/if}
</div>

<style>
  div {
    font-size: 1em;
    position: relative;
    margin-top: 1rem;
  }

  input {
    margin: 0;
    width: 100%;
    background-color: var(--background-1);
    border-radius: 5px;
    border: 1px solid var(--line-1);
    padding: 1.2em 10px 0.3em;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border: 1px solid var(--primary-1);
  }

  label {
    font-size: 1em;
    color: var(--text-3);
    position: absolute;
    left: 10px;
    top: 0.8rem;
    pointer-events: none;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }
</style>