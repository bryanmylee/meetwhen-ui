<script>
  import dayjs from 'dayjs';

  // PROPS
  // =====
  export let startingDay = null;

  // ATTRIBUTES
  // ==========
  const hours = Array.from(Array(24).keys())
    .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
</script>

<div class="index-col">
  <!-- MONTH LABEL -->
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
    z-index: 21;
    min-width: var(--index-col-width);
    background-color: var(--bg);
  }

  .month-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 22;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    padding: 0.5rem;
    box-sizing: border-box;
    border-bottom: 1px var(--grey-400) solid;
    background-color: var(--bg);
  }

  .index-col__cell {
    margin-top: calc(var(--row-height) * 0.5);
    min-height: var(--row-height);
    font-size: 0.8rem;
    color: var(--grey-400);
  }

  .index-col__cell ~ .index-col__cell {
    margin-top: 0;
  }
</style>