<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import { newSelectionDurationPerDayInMs } from '../../../stores.js';

  import CalendarPickerBase from '../CalendarPickerBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventCalendarDefinedSelection
      from './NewEventCalendarDefinedSelection.svelte';
  import NewEventCalendarNewSelection
      from './NewEventCalendarNewSelection.svelte';

  export let daysToShow = [];
  export let selections = [];

  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));

  // The current selection split into different days.
  let newSelections = [];

  const MS_PER_MINUTE = 60000;
  $: {
    if (newSelections.length !== 0) {
      $newSelectionDurationPerDayInMs
          = newSelections[0].end - newSelections[0].start;
    } else {
      $newSelectionDurationPerDayInMs = 15 * MS_PER_MINUTE;
    }
  }

  let startSelection;
  let gridDrag;
  let stopSelection;
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:newSelections={newSelections}
  bind:startSelection={startSelection}
  bind:gridDrag={gridDrag}
  bind:stopSelection={stopSelection}
>
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
</CalendarPickerBase>
