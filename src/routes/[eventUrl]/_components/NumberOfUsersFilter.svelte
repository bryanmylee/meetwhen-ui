<script>
  import { selectedUsernames } from '../stores.js';
  import doubleSlider from 'src/actions/doubleSlider.js';

  // PROPS
  // =====
  export let usernames;

  // REACTIVE ATTRIBUTES
  // ===================
  // $: min = 0;
  // $: max = $selectedUsernames.length !== 0 ? $selectedUsernames.length : usernames.length;
  const min = 0;
  const max = 15;
</script>

<div use:doubleSlider={{min: 25, max: 75, range: 100}} />

<style>
  div {
    color: var(--primary-1);
  }
</style>