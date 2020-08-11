<script>
  export let hour;
</script>

<div class="cell">
  <span class:midnight={hour.hour() === 0}>
    {hour.format('ha')}
  </span>
</div>

<style>
  .cell {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: start;
  }

  .cell:first-of-type {
    margin-top: 1rem;
  }

  .cell:last-of-type {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  span {
    margin-top: -0.6em;
    font-size: 0.8em;
    color: var(--grey-400);
  }

  span.midnight {
    font-weight: 800;
  }

  .cell:last-of-type > span {
    margin-bottom: -0.6em;
  }
</style>