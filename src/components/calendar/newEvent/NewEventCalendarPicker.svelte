<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import { newSelectionDurationPerDayInMs, isSelecting } from '../../../stores.js';

  import CalendarPickerBase from '../CalendarPickerBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventDefinedSelection from './NewEventDefinedSelection.svelte';
  import NewEventNewSelection from './NewEventNewSelection.svelte';

  export let selections = [];
  export let daysToShow = [];

  // The current selection split into different days.
  let newSelections = [];
  const MS_PER_MINUTE = 60000;
  $: $newSelectionDurationPerDayInMs = newSelections.length !== 0
      ? newSelections[0].end - newSelections[0].start
      : 15 * MS_PER_MINUTE;
  $: $isSelecting = newSelections.length !== 0;

  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:newSelections={newSelections}
>
  {#each daysToShow as day}
    <CalendarDayColumn {day} {hours} >
      <!-- Render selections -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewEventDefinedSelection {...selection} />
      {/each}
      <!-- Render new selections -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewEventNewSelection
          start={selection.start}
          duration={$newSelectionDurationPerDayInMs} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>
