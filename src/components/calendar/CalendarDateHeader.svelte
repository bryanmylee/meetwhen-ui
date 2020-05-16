<script>
  import dayjs from 'dayjs';

  export let days = [];
  let monthLabel;
  $: monthLabel = days.length === 0
      ? dayjs().format('MMM')
      : days[0].format('MMM');
</script>

<div id="picker-header-row">
  <div id="month-label">
    {monthLabel}
  </div>
  {#each days as day}
    <div class="cell header-row__cell">
      {day.format('ddd D')}
    </div>
  {/each}
</div>

<style>
  #picker-header-row {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 99;
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
    min-height: var(--header-row-height);
    box-sizing: border-box;
    border-bottom: 1px var(--line-1) solid;
    background-color: white;
  }

  .header-row__cell {
    min-width: var(--col-width);
  }

  #month-label {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: var(--index-col-width);
    background-color: white;
  }
</style>