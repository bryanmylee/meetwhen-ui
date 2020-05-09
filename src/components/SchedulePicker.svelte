<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';

  const today = dayjs();
  const midnight = dayjs().startOf('day');
  let numDays = 60;
  const dates = Array.from(Array(numDays).keys()).map((inc) => today.add(inc, 'day'));
  const times = Array.from(Array(24).keys()).map((inc) => midnight.add(inc, 'hour'));
</script>

<div id="picker">
  <div id="header-row">
    <div id="month-label">
      May
    </div>
    {#each dates as date}
      <div class="cell">
        {date.format('D')}
      </div>
    {/each}
  </div>
  <div id="main-area">
    <div id="time-col">
      {#each times as time}
        <div class="cell">
          {time.format('HH:mm')}
        </div>
      {/each}
    </div>
    {#each dates as date}
      <div class="col">
        {#each times as time}
          <div class="cell"></div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
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
    width: 4em;
    background-color: white;
  }

  #header-row {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-direction: row;
    width: fit-content;
    min-height: 2em;
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    background-color: white;
  }

  #header-row > .cell {
    min-width: 4em;
    min-height: 2em;
  }

  #time-col {
    position: sticky;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 4em;
    background-color: white;
  }

  #main-area {
    display: flex;
    flex-direction: row;
    width: fit-content;
  }

  .cell {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 3em;
  }

  .col {
    min-width: 4em;
    box-sizing: border-box;
    border-right: 1px lightgrey solid;
  }
</style>