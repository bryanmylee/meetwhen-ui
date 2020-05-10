<script>
  import dayjs from 'dayjs';

  import CalendarHourCell from './CalendarHourCell.svelte';

  const midnightToday = dayjs().startOf('day');
  let numDaysToShow = 21;
  // List of days
  const dates = Array.from(Array(numDaysToShow).keys())
      .map((inc) => midnightToday.add(inc, 'day'));
  // List of hours
  const hours = Array.from(Array(24).keys())
      .map((inc) => midnightToday.add(inc, 'hour'));

  let selections = [];

  function startSelection(e) {
    const { datetime } = e.detail;
    selections = [...selections, {
      start: datetime,
      curr: datetime,
      isActive: true,
    }];
  }

  function gridDrag(e) {
    const { datetime } = e.detail;
    const { length } = selections;
    if (length === 0) return;
    const activeSelection = selections[length - 1];
    activeSelection.curr = datetime;
    selections = [...selections.slice(0, length - 1), activeSelection];
  }

  function stopSelection(e) {
    const { datetime } = e.detail;
    const activeSelection = selections[selections.length - 1];
    activeSelection.curr = datetime;
    activeSelection.isActive = false;
  }

  function getTop(selection) {
    // The size of top is rowHeight * numHours from midnight.
    const { start } = selection;
    const numHours = start.hour() + start.minute() / 60;
    return `${numHours * 3}rem`;
  }

  function getLeft(selection) {
    // The size of left is colWidth * numDays from today.
    const { start } = selection;
    const millisecondsBetween = start - midnightToday;
    const numDays = Math.floor(millisecondsBetween / 1000 / 60 / 60 / 24);
    return `${numDays * 6}rem`;
  }

  function getHeight(selection) {
    const { start, curr } = selection;
    // Set the tail of the selection box based on the time released.
    // The height is rowHeight * (numQuarterHours between start and end
    // inclusive) / 4;
    const numQuarterHours = Math.floor((curr - start) / 1000 / 60 / 15) + 1;
    const numHoursSelected = numQuarterHours / 4;
    return `${numQuarterHours / 4 * 3}rem`
  }
</script>

<div id="picker">
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
      <div id="main-area__bg-grid">
        {#each dates as date}
          {#each hours as hour}
            <CalendarHourCell
              start={date.hour(hour.hour())}
              on:startSelection={startSelection}
              on:stopSelection={stopSelection}
              on:drag={gridDrag}/>
          {/each}
        {/each}
      </div>
      <div id="main-area__selection-layer">
        {#each selections as selection}
          <div
            class="selection-box"
            style="height:{getHeight(selection)}; top:{getTop(selection)}; left:{getLeft(selection)}"
          ></div>
        {/each}
        <!-- <div class="selection-box"></div> -->
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
    z-index: 100;
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
    z-index: 90;
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
    position: relative;
  }

  #main-area__bg-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(24, var(--row-height));
    grid-auto-columns: var(--col-width);
    width: fit-content;
    height: fit-content;
  }

  :global(.main-area__bg-cell) {
    min-width: var(--col-width);
    min-height: var(--row-height);
    box-sizing: border-box;
    border-bottom: 1px #eeeeee solid;
    border-right: 1px #dddddd solid;
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

  .selection-box {
    grid-column: 1/2;
    position: absolute;
    width: var(--col-width);
    background-color: teal;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    /* pointer-events: all; */
  }
</style>