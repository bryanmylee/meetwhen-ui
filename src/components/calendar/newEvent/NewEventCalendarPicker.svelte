<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import { newSelectionDurationPerDayInMs } from '../../../stores.js';
  import { getMultiDaySelection } from '../../../utils/selections.js';

  import CalendarBase from '../CalendarBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventCalendarDefinedSelection
      from './NewEventCalendarDefinedSelection.svelte';
  import NewEventCalendarNewSelection
      from './NewEventCalendarNewSelection.svelte';

  export let daysToShow = [];
  export let selections = [];

  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));

  // The new selection being made.
  let newSelection = null;
  // The current selection split into different days.
  let newSelections = [];

  const MS_PER_MINUTE = 60000;
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
    selections = [
      ...selections,
      ...newSelections,
    ];
    newSelection = null;
  }
</script>

<CalendarBase>
  {#each daysToShow as day}
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
        <NewEventCalendarNewSelection
          start={selection.start}
          duration={$newSelectionDurationPerDayInMs} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarBase>
