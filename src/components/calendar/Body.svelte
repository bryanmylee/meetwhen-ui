<script>
  import dayjs from 'dayjs';

  import TimeColumn from './TimeColumn.svelte';
  import Grid from './Grid.svelte';

  export let days;
  export let hours;
  export let selections;
</script>

<div>
  <TimeColumn />
  <Grid
    {days} {hours} {selections}
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