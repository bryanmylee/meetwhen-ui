<script>
  // BINDINGS
  // ========
  export let value;

  // PROPS
  // =====
  export let min = 0;
  export let max = 100;
  export let step = 1;
</script>

<input
  type="range"
  on:input={event => value = event.target.value}
  {min}
  {max}
  {step}
  {value}
/>

<!-- Adapted from https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ -->
<style>
  input {
    width: 100%;
    -webkit-appearance: none;
    background: transparent;
  }

  input:focus {
    outline: none;
  }

  /* For the thumb */
  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -6px; /* For Chrome/Safari */
    border: 1px solid var(--line-1);
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background: var(--background-0);
    cursor: pointer;
  }

  input::-moz-range-thumb {
    border: 1px solid var(--line-1);
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background: var(--background-0);
    cursor: pointer;
  }

  /* For the track */
  input::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--line-2);
    cursor: pointer;
  }

  input::-moz-range-track {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--line-2);
    cursor: pointer;
  }

  input::-ms-track {
    width: 100%;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
</style>