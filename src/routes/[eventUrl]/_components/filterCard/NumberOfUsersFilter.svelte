<script>
  import { selectedUsernames } from '../../stores.js';

  import { RangeSlider } from 'src/components/form';

  // PROPS
  // =====
  export let usernames;

  // REACTIVE ATTRIBUTES
  // ===================
  const min = 1;
  $: max = $selectedUsernames.length !== 0 ? $selectedUsernames.length : usernames.length;

  // STATE
  // =====
  let value;
  $: console.log(value);
</script>

<div>
  <label class="min">{min}</label>
  <RangeSlider bind:value={value} {min} {max} />
  <label class="max">{max}</label>
</div>

<style>
  div {
    margin-top: 0.8rem;
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