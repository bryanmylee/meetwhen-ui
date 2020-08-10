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
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: var(--row-height);
  }

  .cell:first-of-type {
    margin-top: 1rem;
  }

  .cell:last-of-type {
    min-height: min-content;
    padding-top: calc(var(--row-height) * 0.5 - 0.5em);
    margin-bottom: 5rem;
  }

  span {
    font-size: 0.8em;
    color: var(--grey-400);
  }

  span.midnight {
    font-weight: 800;
  }
</style>