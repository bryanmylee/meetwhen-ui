<script>
  import { createLinkedWidthActions } from './RangeSlider';

  const [listenWidth, setWidth] = createLinkedWidthActions();

  // BINDINGS
  // ========
  export let value;

  // PROPS
  // =====
  export let min = 0;
  export let max = 100;
</script>

<div>
  <input
    use:listenWidth
    type="range"
    on:input={(event) => value = event.target.value}
    {min}
    {max}
    {value}
  />
  <span use:setWidth={{ thumbRadius: 12, value, min, max }}/>
</div>

<!-- Adapted from https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ -->
<style>
  div {
    width: 100%;
    position: relative;
  }

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
    margin-top: -13px; /* For Chrome/Safari */
    border: 9px solid transparent;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background: var(--primary-500);
    background-clip: padding-box;
    cursor: pointer;
  }

  input::-moz-range-thumb {
    border: 9px solid transparent;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background: var(--primary-500);
    background-clip: padding-box;
    cursor: pointer;
    box-sizing: border-box;
  }

  /* For the track */
  input::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background-color: var(--grey-200);
    cursor: pointer;
  }

  input::-moz-range-track {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--grey-200);
    cursor: pointer;
  }

  input::-ms-track {
    width: 100%;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  /* For the filled-in track */
  span {
    position: absolute;
    top: 9px;
    left: 0;
    height: 6px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    background-color: var(--primary-500);
    pointer-events: none;
  }
</style>