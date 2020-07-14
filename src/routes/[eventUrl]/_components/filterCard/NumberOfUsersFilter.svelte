<script>
  import { selectedUsernames } from '../../stores.js';

  import DoubleSlider from 'src/components/form/DoubleSlider.svelte';

  // PROPS
  // =====
  export let usernames;

  // REACTIVE ATTRIBUTES
  // ===================
  // $: min = 0;
  // $: max = $selectedUsernames.length !== 0 ? $selectedUsernames.length : usernames.length;
  let min = 0;
  let max = 15;
</script>

<div>
  <label class="min">{min}</label>
  <DoubleSlider bind:min={min} bind:max={max} range=100 />
  <label class="max">{max}</label>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }

  label {
    width: 2em;
    text-align: center;
  }

  label.min {
    margin-right: 0.8em;
  }

  label.max {
    margin-left: 0.8em;
  }
</style>