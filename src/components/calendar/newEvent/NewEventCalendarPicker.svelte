<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import CalendarPickerBase from '../CalendarPickerBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventDefinedSelection from './NewEventDefinedSelection.svelte';
  import NewEventNewSelection from './NewEventNewSelection.svelte';

  // The defined selections to be bound and exposed as the input data.
  export let selections = [];

  export let daysToShow = [];
</script>

<CalendarPickerBase
  daysToShow={daysToShow}
  bind:selections={selections}
  let:newSelections={newSelections}
>
  {#each daysToShow as day}
    <CalendarDayColumn {day} >
      <!-- Render selections -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewEventDefinedSelection {...selection} />
      {/each}
      <!-- Render new selections -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewEventNewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>
