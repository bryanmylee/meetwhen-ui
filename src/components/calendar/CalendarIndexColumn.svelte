<script>
  import dayjs from 'dayjs';

  export let startingDay = null;

  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
</script>

<div class="index-col">
  <div class="month-label">
    {startingDay == null ? 'NIL' : startingDay.format('MMM')}
  </div>
  {#each hours as hour}
    <div class="cell index-col__cell">
      {hour.add(1, 'hour').format('ha')}
    </div>
  {/each}
</div>

<style>
  .index-col {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    left: 0;
    z-index: 100;
    min-width: var(--index-col-width);
    background-color: white;
  }

  .month-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    padding: 0.5rem;
    box-sizing: border-box;
    border-bottom: 1px var(--line-1) solid;
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