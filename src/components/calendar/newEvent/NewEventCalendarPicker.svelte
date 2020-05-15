<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import hotkeys from 'hotkeys-js';

  import { createHistory } from '../../../utils/history.js';
  const history = createHistory();
  history.init({ selections: [] });
  import CalendarDateHeader from '../CalendarDateHeader.svelte';
  import CalendarTimeColumn from '../CalendarTimeColumn.svelte';
  import CalendarGrid from '../CalendarGrid.svelte';
  import NewEventCalendarSelectionLayer
      from './NewEventCalendarSelectionLayer.svelte';

  // Expose selections to parent component.
  export let selections;
  $: selections = $history.current().selections;

  const startDate = dayjs().startOf('day');
  const numDaysToShow = 21;
  const days = Array.from(Array(numDaysToShow).keys())
      .map((inc) => startDate.add(inc, 'day'));
  const hours = Array.from(Array(24).keys())
      .map((inc) => startDate.add(inc, 'hour'));

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
    if (!newSelection || !newSelection.start || !newSelection.end) return;
    // Update history
    history.push({
      // New state of selections includes selections from the current state.
      selections: [
        ...$history.current().selections,
        ...splitMultiDaySelection(newSelection),
      ],
    });
    newSelection = null;
  }

  // Separate a multi-day selection into multiple single-day selections.
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

  onMount(() => {
    hotkeys('ctrl+z, command+z', (e) => {
      e.preventDefault();
      history.undo();
    });

    hotkeys('shift+ctrl+z, shift+command+z', (e) => {
      e.preventDefault();
      history.redo();
    });
  })
</script>

<div id="picker" class="card">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div>
    <CalendarDateHeader {days} />
    <div id="body">
      <CalendarTimeColumn />
      <div id="select-area">
        <CalendarGrid {days} {hours}
          on:startSelection={startSelection}
          on:gridDrag={gridDrag}
          on:stopSelection={stopSelection}
        />
        <NewEventCalendarSelectionLayer
          selections={$history.current().selections} {newSelection}
        />
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