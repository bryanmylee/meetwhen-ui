<script>
  import dayjs from 'dayjs';

  // ATTRIBUTES
  // ==========
  const hours = Array.from(Array(24).keys())
    .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
</script>

<div class="index-col">
  {#each hours as hour}
    <div class="cell index-col__cell">
      <span>
        {hour.add(1, 'hour').format('ha')}
      </span>
    </div>
  {/each}
</div>

<style>
  .index-col {
    position: sticky;
    left: -1px;
    z-index: 21;
    min-width: var(--index-col-width);
    background-color: var(--bg);
  }

  .index-col__cell {
    margin-top: 0;
    min-height: var(--row-height);
  }

  .index-col__cell span {
    font-size: 0.8em;
    color: var(--grey-400);
  }

  .index-col__cell:first-of-type {
    margin-top: var(--row-height);
  }

  .index-col__cell:last-of-type {
    min-height: min-content;
    padding-top: calc(var(--row-height) * 0.5 - 0.5em);
    margin-bottom: -0.5em;
  }
</style>