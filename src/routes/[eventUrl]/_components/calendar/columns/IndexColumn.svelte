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
      <span>
        {hour.add(1, 'hour').format('ha')}
      </span>
    </div>
  {/each}
</div>

<style>
  .index-col {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    left: -1px;
    z-index: 21;
    min-width: var(--index-col-width);
    background-color: var(--bg);
  }

  .month-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: -1px;
    z-index: 22;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    padding: 0.5em;
    box-sizing: border-box;
    border-bottom: 1px var(--grey-400) solid;
    background-color: var(--bg);
  }

  .index-col__cell {
    margin-top: calc(var(--row-height) * 0.5);
    min-height: var(--row-height);
  }

  .index-col__cell span {
    font-size: 0.8em;
    color: var(--grey-400);
  }

  .index-col__cell ~ .index-col__cell {
    margin-top: 0;
  }
</style>