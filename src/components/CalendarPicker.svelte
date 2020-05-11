<script>
  import dayjs from 'dayjs';

  import HeaderRow from './calendar/HeaderRow.svelte';
  import Body from './calendar/Body.svelte';

  const startDate = dayjs().startOf('day');
  const numDaysToShow = 21;
  const days = Array.from(Array(numDaysToShow).keys())
      .map((inc) => startDate.add(inc, 'day'));
  const hours = Array.from(Array(24).keys())
      .map((inc) => startDate.add(inc, 'hour'));

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
    console.log(selections);
  }
</script>

<div id="picker">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div>
    <HeaderRow {days} />
    <Body
      {days} {hours} {selections}
      on:startSelection={startSelection}
      on:gridDrag={gridDrag}
      on:stopSelection={stopSelection}
    />
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

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>