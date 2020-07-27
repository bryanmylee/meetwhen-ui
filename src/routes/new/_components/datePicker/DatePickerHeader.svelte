<script>
  import MonthPicker from './MonthPicker.svelte';

  export let month;
</script>

<div>
  <h3>
    When are you free?
  </h3>
  <MonthPicker bind:month/>
</div>

<style>
  h3 {
    margin-left: 0.8rem;
    padding-bottom: 0.8rem;
  }
</style>