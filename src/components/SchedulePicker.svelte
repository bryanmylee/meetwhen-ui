<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';

  const today = dayjs();
  const midnight = dayjs().startOf('day');
  let numDays = 60;
  const dates = Array.from(Array(numDays).keys()).map((inc) => today.add(inc, 'day'));
  const times = Array.from(Array(24).keys()).map((inc) => midnight.add(inc, 'hour'));

  let header;
  let timeCol;
  let mainArea;

  let scrollTriggered = false;
  onMount(() => {
    header.addEventListener('scroll', () => {
      if (scrollTriggered) {
        scrollTriggered = false;
        return;
      }
      scrollTriggered = true;
      mainArea.scrollLeft = header.scrollLeft;
    });
    timeCol.addEventListener('scroll', () => {
      if (scrollTriggered) {
        scrollTriggered = false;
        return;
      }
      scrollTriggered = true;
      mainArea.scrollTop = timeCol.scrollTop;
    });
    mainArea.addEventListener('scroll', () => {
      if (scrollTriggered) {
        scrollTriggered = false;
        return;
      }
      scrollTriggered = true;
      header.scrollLeft = mainArea.scrollLeft;
      timeCol.scrollTop = mainArea.scrollTop;
    });
  });
</script>

<div id="picker">
  <div id="top-left">
    Times
  </div>
  <div id="header-row" bind:this={header}>
    {#each dates as date}
      <div class="cell">
        {date.format('D')}
      </div>
    {/each}
  </div>
  <div id="time-col" bind:this={timeCol}>
    {#each times as time}
      <div class="cell">
        {time.format('HH:mm')}
      </div>
    {/each}
  </div>
  <div id="main-area" bind:this={mainArea}>
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
    display: grid;
    grid-template-columns: 5em auto;
    grid-auto-rows: fit-content(500px);
    border: 1px black solid;
    width: auto;
  }

  #top-left {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 2em;
    min-width: 3em;
  }

  #header-row {
    display: flex;
    flex-direction: row;
    min-height: 2em;
    overflow-y: scroll;
    border: 1px red solid;
  }

  #header-row::-webkit-scrollbar {
    display: none;
  }

  #header-row > .cell {
    min-height: 2em;
  }

  #time-col {
    display: flex;
    flex-direction: column;
    min-width: 3em;
    overflow-y: scroll;
    border: 1px cyan solid;
  }

  #time-col::-webkit-scrollbar {
    display: none;
  }

  #main-area {
    display: flex;
    flex-direction: row;
    min-width: 4em;
    overflow: scroll;
    border: 1px pink solid;
  }

  #main-area::-webkit-scrollbar {
    display: none;
  }

  .col > .cell {
    border: 1px lightblue solid;
  }

  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 4em;
    min-height: 3em;
    border: 1px lightgrey solid;
  }
</style>