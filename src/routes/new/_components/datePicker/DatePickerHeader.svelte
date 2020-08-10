<script>
  import MonthPicker from './MonthPicker.svelte';

  export let month;
</script>

<div>
  <h3>
    Set a time for everyone
  </h3>
  <MonthPicker bind:month/>
</div>

<style>
  div {
    margin: -0.4em 0.8em 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>