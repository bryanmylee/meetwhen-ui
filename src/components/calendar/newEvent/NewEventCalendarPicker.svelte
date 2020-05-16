<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import hotkeys from 'hotkeys-js';

  import CalendarIndexColumn from '../CalendarIndexColumn.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventCalendarDefinedSelection
      from './NewEventCalendarDefinedSelection.svelte';
  import NewEventCalendarNewSelection
      from './NewEventCalendarNewSelection.svelte';

  export let history;
  $: selections = $history.current().selections;

  const startDate = dayjs().startOf('day');
  const numDaysToShow = 21;
  const days = Array.from(Array(numDaysToShow).keys())
      .map((inc) => startDate.add(inc, 'day'));
  const hours = Array.from(Array(24).keys())
      .map((inc) => startDate.add(inc, 'hour'));

  // The new selection being made.
  let newSelection = null;
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

  // Separate a multi-day new selection into multiple single-day selections.
  function splitMultiDaySelection(newSelection) {
    if (newSelection == null || newSelection.start == null) return [];
    const { start, end } = newSelection;
    const endOnStartDay = end
        .date(start.date())
        .month(start.month())
        .year(start.year());
    const selections = [];
    // Determine how many days are included from start to end.
    const numDaysSpan = Math.floor((end - start) / 86400000) + 1;
    for (let i = 0; i < numDaysSpan; i++) {
      selections.push({
        start: start.add(i, 'day'),
        end: endOnStartDay.add(i, 'day'),
      });
    }
    return selections;
  }

  // The current selection split into different days.
  let newSelections = [];
  $: newSelections = splitMultiDaySelection(newSelection);

  // Keyboard event listeners
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
  <div id="body">
    <CalendarIndexColumn />
    {#each days as day}
      <CalendarDayColumn {day} {hours}
        on:startSelection={startSelection}
        on:gridDrag={gridDrag}
        on:stopSelection={stopSelection}
      >
        <!-- Render selections -->
        {#each selections.filter((selection) =>
            selection.start.isSame(day, 'date')) as selection}
          <NewEventCalendarDefinedSelection {...selection} />
        {/each}
        <!-- Render new selections -->
        {#each newSelections.filter((selection) =>
            selection.start.isSame(day, 'date')) as selection}
          <NewEventCalendarNewSelection {...selection} />
        {/each}
      </CalendarDayColumn>
    {/each}
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

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>