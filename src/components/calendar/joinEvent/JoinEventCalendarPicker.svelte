<script>
  import dayjs from 'dayjs';

  import CalendarDateHeader from '../CalendarDateHeader.svelte';
  import CalendarTimeColumn from '../CalendarTimeColumn.svelte';
  import CalendarGrid from '../CalendarGrid.svelte';
  /*
   * eventIntervals: {start: Dayjs, end: Dayjs}[]
   */
  export let eventIntervals = [];
  export let userIntervalsByUsername = {};

  let daysToShow = eventIntervals.map((interval) => interval.start.startOf('day'));
  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
</script>

<div id="picker" class="card">
  <div>
    <CalendarDateHeader days={daysToShow} />
    <div id="body">
      <CalendarTimeColumn />
      <div id="select-area">
        <CalendarGrid days={daysToShow} {hours} />
        <!-- Other user selections -->
        <!-- Selection layer -->
      </div>
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
    width: auto;
    margin-bottom: 1em;
    overflow: scroll;
    scroll-behavior: smooth;
  }

  #body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
  }

  #select-area {
    position: relative;
  }

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>