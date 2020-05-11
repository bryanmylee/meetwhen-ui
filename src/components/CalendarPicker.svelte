<script>
  import dayjs from 'dayjs';

  import CalendarGridCell from './CalendarGridCell.svelte';
  import CalendarSelection from './CalendarSelection.svelte';

  const midnightToday = dayjs().startOf('day');
  let numDaysToShow = 21;
  // List of days
  const dates = Array.from(Array(numDaysToShow).keys())
      .map((inc) => midnightToday.add(inc, 'day'));
  // List of hours
  const hours = Array.from(Array(24).keys())
      .map((inc) => midnightToday.add(inc, 'hour'));

  export let selections = [];

  function startSelection(e) {
    const { datetime } = e.detail;
    selections = [...selections, {
      start: datetime,
      // datetime represents the start of the cell.
      // Add 15 minutes to account for the time in the last cell.
      end: datetime.add(15, 'minute'),
      isActive: true,
    }];
  }

  function gridDrag(e) {
    const { datetime } = e.detail;
    const { length } = selections;
    if (length === 0) return;
    const activeSelection = selections[length - 1];
    // datetime represents the start of the cell.
    // Add 15 minutes to account for the time in the last cell.
    activeSelection.end = datetime.add(15, 'minute');
    selections = [...selections.slice(0, length - 1), activeSelection];
  }

  function stopSelection() {
    const { length } = selections;
    if (length === 0) return;
    const activeSelection = selections[length - 1];
    activeSelection.isActive = false;
    if (activeSelection.end - activeSelection.start < 15) {
      activeSelection.end = activeSelection.start.add(15, 'minute');
    }
    selections = [...selections.slice(0, length - 1), activeSelection];
  }
</script>

<div id="picker">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div>
    <div id="picker-header-row">
      <div id="month-label">
        {midnightToday.format('MMM')}
      </div>
      {#each dates as date}
        <div class="cell header-row__cell">
          {date.format('ddd D')}
        </div>
      {/each}
    </div>
    <div id="picker-body">
      <div id="index-col">
        {#each hours as hour}
          <div class="cell index-col__cell">
            {hour.add(1, 'hour').format('HH:mm')}
          </div>
        {/each}
      </div>
      <div id="main-area">
        <div id="main-area__bg-grid" on:mouseleave={stopSelection}>
          {#each dates as date}
            {#each hours as hour}
              <CalendarGridCell
                start={date.hour(hour.hour())}
                on:startSelection={startSelection}
                on:drag={gridDrag}
                on:stopSelection={stopSelection}/>
            {/each}
          {/each}
        </div>
        <div id="main-area__selection-layer">
          {#each selections as selection}
            <CalendarSelection {...selection} />
          {/each}
        </div>
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
    border-radius: 2px;
    box-shadow: var(--box-shadow);
  }

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

  #picker-body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
  }

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

  #main-area {
    position: relative;
  }

  #main-area__bg-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(24, var(--row-height));
    grid-auto-columns: var(--col-width);
  }

  #main-area__selection-layer {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>