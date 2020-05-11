<script>
  import dayjs from 'dayjs';

  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
</script>

<div id="index-col">
  {#each hours as hour}
    <div class="cell index-col__cell">
      {hour.add(1, 'hour').format('HH:mm')}
    </div>
  {/each}
</div>

<style>
  #index-col {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    left: 0;
    z-index: 90;
    min-width: var(--index-col-width);
    background-color: white;
  }

  .index-col__cell {
    margin-top: calc(var(--row-height) * 0.5);
    min-height: var(--row-height);
    font-size: 0.8rem;
    color: var(--text-3);
  }

  .index-col__cell ~ .index-col__cell {
    margin-top: 0;
  }
</style>