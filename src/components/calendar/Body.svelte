<script>
  import dayjs from 'dayjs';

  import TimeColumn from './TimeColumn.svelte';
  import Grid from './Grid.svelte';

  export let days;
  export let hours;
  export let selections;
  export let newSelection;
</script>

<div>
  <TimeColumn />
  <Grid
    {days} {hours} {selections} {newSelection}
    on:startSelection on:gridDrag on:stopSelection
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
  }
</style>