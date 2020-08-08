<script>
  import { selectedUsernames, minUserCountFilter } from '../../_stores';

  import { RangeSlider } from 'src/components/form';

  // PROPS
  // =====
  export let usernames;

  // REACTIVE ATTRIBUTES
  // ===================
  const min = 0;
  $: max = $selectedUsernames.length !== 0 ? $selectedUsernames.length : usernames.length;
  $: {
    if (max < $minUserCountFilter) {
      $minUserCountFilter = max;
    }
  }
</script>

<div>
  <RangeSlider bind:value={$minUserCountFilter} {min} {max} />
  <label>{$minUserCountFilter} / {max}</label>
</div>

<style>
  div {
    margin-top: 0.8em;
    display: flex;
    align-items: center;
  }

  label {
    width: 4em;
    text-align: center;
    margin-left: 0.8em;
  }
</style>