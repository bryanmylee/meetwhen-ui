<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import { isSelecting } from './stores.js';

  import CalendarPickerBase from 'src/components/calendar/CalendarPickerBase.svelte';
  import CalendarDayColumn from 'src/components/calendar/CalendarDayColumn.svelte';
  import DefinedSelection from './DefinedSelection.svelte';
  import NewSelection from './NewSelection.svelte';

  // BINDINGS
  // ========
  export let selections = [];

  // PROPS
  // =====
  export let daysToShow = [];
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:isSelecting={$isSelecting}
  {daysToShow}
  let:newSelections={newSelections}
>
  <!-- COLUMNS -->
  {#each daysToShow as day}
    <CalendarDayColumn {day} >
      <!-- DEFINED SELECTIONS -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <DefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>
