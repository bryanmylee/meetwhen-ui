<script>
  import doubleSlider from 'src/actions/doubleSlider.js';

  // BINDINGS
  // ========
  export let min;
  export let max;

  // PROPS
  // =====
  export let range;

  // EVENT LISTENERS
  // ===============
  function handleChange(event) {
    const { detail } = event;
    min = detail.min;
    max = detail.max;
  }
</script>


<div use:doubleSlider={{min, max, range}} on:sliderInput={handleChange} />

<style>
  div {
    color: var(--primary-1);
    width: 100%;
  }
</style>