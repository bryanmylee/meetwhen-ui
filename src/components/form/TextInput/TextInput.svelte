<script>
  import { inputAction, labelAction } from './TextInput';

  import ErrorTip from 'src/components/ui/ErrorTip.svelte';
  import RequiredTooltip from './RequiredTooltip.svelte';

  // BINDINGS
  // ========
  export let value;
  export let valid;
  $: {
    try {
      if (validationFunction) validationFunction(value);
      valid = true;
      errorMessage = null;
    } catch (err) {
      valid = false;
      if (!valid && attempted) errorMessage = err.message;
    }
  }

  // PROPS
  // =====
  export let label = 'Label';
  export let required = false;
  export let isPassword = false;
  export let attempted = false;
  export let tip = '';
  export let style = '';
  export let validationFunction;

  // STATE
  // =====
  let focused = false;
  let errorMessage = null;
</script>

<div {style}>
  <input use:inputAction={{ isPassword, focused, value, showError: !valid && attempted }} bind:value={value}
    on:focus={() => focused = true}
    on:blur={() => focused = false}
    on:keydown
    on:keyup
  />
  <label use:labelAction={{ focused, value, showError: !valid && attempted }}>
    {label}
  </label>
  {#if required}
    <RequiredTooltip />
  {/if}
  <ErrorTip show={errorMessage != null}>{errorMessage}</ErrorTip>
  {#if tip && tip.trim().length !== 0}
    <h5 class="tip">{tip}</h5>
  {/if}
</div>

<style>
  div {
    font-size: 1em;
    position: relative;
  }

  input {
    margin: 0;
    width: 100%;
    background-color: var(--grey-100);
    border-radius: 5px;
    border: 1px solid transparent;
    padding: 1.2em 10px 0.3em;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border: 1px solid var(--primary-500);
  }

  label {
    font-size: 1em;
    color: var(--text-400);
    position: absolute;
    left: 10px;
    top: 0.8em;
    pointer-events: none;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }
</style>