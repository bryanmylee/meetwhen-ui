<script>
  import dayjs from 'dayjs';

  import HeaderRow from './HeaderRow.svelte';
  import Body from './Body.svelte';

  const startDate = dayjs().startOf('day');
  const numDaysToShow = 21;
  const days = Array.from(Array(numDaysToShow).keys())
      .map((inc) => startDate.add(inc, 'day'));
  const hours = Array.from(Array(24).keys())
      .map((inc) => startDate.add(inc, 'hour'));

  // The selections made by the user.
  export let selections = [];
  // The new selection being made.
  let newSelection;

  function startSelection(e) {
    const { datetime } = e.detail;
    newSelection = ({
      start: datetime,
      // datetime represents the start of the cell.
      // Add 15 minutes to account for the time in the last cell.
      end: datetime.add(15, 'minute'),
    });
  }

  function gridDrag(e) {
    const { datetime } = e.detail;
    // datetime represents the start of the cell.
    // Add 15 minutes to account for the time in the last cell.
    newSelection = ({ ...newSelection,
      end: datetime.add(15, 'minute'),
    });
  }

  function stopSelection() {
    if (!newSelection) return;
    selections = [
      ...selections,
      ...splitMultiDaySelection(newSelection),
    ];
    newSelection = null;
  }

  function splitMultiDaySelection(newSelection) {
    const { start, end } = newSelection;
    const endOnStartDay = end
        .date(start.date())
        .month(start.month())
        .year(start.year());
    const selectionByDay = [];
    // Determine how many days are included from start to end.
    const numDaysSpan = Math.floor((end - start) / 86400000) + 1;
    for (let i = 0; i < numDaysSpan; i++) {
      selectionByDay.push({
        start: start.add(i, 'day'),
        end: endOnStartDay.add(i, 'day'),
      });
    }
    return selectionByDay;
  }
</script>

<div id="picker" class="card">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div>
    <HeaderRow {days} />
    <Body
      {days} {hours} {selections} {newSelection}
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
  }

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>