<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import CalendarPickerBase from '../CalendarPickerBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import NewEventDefinedSelection from './NewEventDefinedSelection.svelte';
  import NewEventNewSelection from './NewEventNewSelection.svelte';

  // COMPONENT BINDINGS
  // ==================
  export let selections = [];

  // PROPS
  // =====
  export let daysToShow = [];
</script>

<CalendarPickerBase
  bind:selections={selections}
  {daysToShow}
  let:newSelections={newSelections}
>
  <!-- COLUMNS -->
  {#each daysToShow as day}
    <CalendarDayColumn {day} >
      <!-- DEFINED SELECTIONS -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewEventDefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewEventNewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>
