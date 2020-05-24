<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import hotkeys from 'hotkeys-js';

  import { newSelectionDurationPerDayInMs } from '../../../stores.js';
  import { getMultiDaySelection } from '../../../utils/selections.js';

  import CalendarIndexColumn from '../CalendarIndexColumn.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventCalendarDefinedSelection
      from './NewEventCalendarDefinedSelection.svelte';
  import NewEventCalendarNewSelection
      from './NewEventCalendarNewSelection.svelte';

  export let history;
  $: selections = $history.selections;

  const startDate = dayjs().startOf('day');
  const numDaysToShow = 21;
  const days = Array.from(Array(numDaysToShow).keys())
      .map((inc) => startDate.add(inc, 'day'));
  const hours = Array.from(Array(24).keys())
      .map((inc) => startDate.add(inc, 'hour'));

  const MS_PER_MINUTE = 60000;

  // The new selection being made.
  let newSelection = null;
  // The current selection split into different days.
  let newSelections = [];
  $: {
    if (newSelection != null) {
      newSelections = getMultiDaySelection(newSelection);
      $newSelectionDurationPerDayInMs
          = newSelections[0].end - newSelections[0].start;
    } else {
      newSelections = [];
      $newSelectionDurationPerDayInMs = 15 * MS_PER_MINUTE;
    }
  }

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
    $history = { ...$history,
      selections: [
        ...$history.selections,
        ...newSelections,
      ]
    };
    newSelection = null;
  }

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
  <div id="body" on:mouseleave={stopSelection}>
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
          <NewEventCalendarNewSelection start={selection.start} />
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