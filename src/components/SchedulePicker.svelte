<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';

  const today = dayjs();
  const midnight = dayjs().startOf('day');
  let numDays = 60;
  const dates = Array.from(Array(numDays).keys()).map((inc) => today.add(inc, 'day'));
  const times = Array.from(Array(24).keys()).map((inc) => midnight.add(inc + 1, 'hour'));
</script>

<div id="picker">
  <div id="picker-header-row">
    <div id="month-label">
      {today.format('MMM')}
    </div>
    {#each dates as date}
      <div class="cell header-row__cell">
        {date.format('ddd D')}
      </div>
    {/each}
  </div>
  <div id="picker-body">
    <div id="index-col">
      {#each times as time}
        <div class="cell index-col__cell">
          {time.format('HH:mm')}
        </div>
      {/each}
    </div>
    <div id="main-area">
      {#each dates as date}
        <div class="col">
          {#each times as time}
            <div class="cell main-area__cell"></div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :root {
    --index-col-width: 4rem;
    --header-row-height: 2rem;
    --col-width: 6rem;
    --row-height: 3rem;
  }

  #picker {
    display: flex;
    flex-direction: column;
    width: auto;
    max-height: 600px;
    overflow: scroll;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  #month-label {
    position: sticky;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--index-col-width);
    background-color: white;
  }

  #picker-header-row {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-direction: row;
    width: fit-content;
    min-height: var(--header-row-height);
    box-sizing: border-box;
    border-bottom: 1px #dddddd solid;
    background-color: white;
  }

  .header-row__cell {
    width: var(--col-width);
  }

  #picker-body {
    display: flex;
    flex-direction: row;
    width: fit-content;
  }

  #index-col {
    position: sticky;
    left: 0;
    display: flex;
    flex-direction: column;
    width: var(--index-col-width);
    height: fit-content;
    background-color: white;
  }

  .index-col__cell {
    margin-top: calc(var(--row-height) * 0.5);
    min-height: var(--row-height);
    font-size: 0.8rem;
    color: #aaaaaa;
  }

  .index-col__cell ~ .index-col__cell {
    margin-top: 0;
  }

  #main-area {
    display: flex;
    flex-direction: row;
    width: fit-content;
    height: fit-content;
  }

  .main-area__cell {
    min-height: var(--row-height);
    box-sizing: border-box;
    border-bottom: 1px #eeeeee solid;
  }

  .cell {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .col {
    min-width: var(--col-width);
    box-sizing: border-box;
    border-right: 1px #dddddd solid;
  }
</style>