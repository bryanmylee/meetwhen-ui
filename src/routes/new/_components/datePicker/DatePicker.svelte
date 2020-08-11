<script>
  import dayjs from 'dayjs';

  import datePickerInteraction from './actions/datePickerInteraction';

  import DatePickerHeader from './DatePickerHeader.svelte';
  import DaysOfTheWeek from './DaysOfTheWeek.svelte';
  import DateSelectionProvider from './DateSelectionProvider.svelte';
  import Date from './Date.svelte';

  // BINDINGS
  // ========
  export let selectedDays = [];

  // STATE
  // =====
  let selectedMonth = dayjs();

  // REACTIVE ATTRIBUTES
  // =====
  $: numDays = selectedMonth.daysInMonth();
  $: days = Array.from(Array(numDays).keys())
    .map((inc) => selectedMonth.date(1).add(inc, 'day'));
</script>

<div class="picker-container">
  <DatePickerHeader bind:month={selectedMonth} />
  <DaysOfTheWeek/>
  <DateSelectionProvider
    bind:selectedDays
    let:highlightedDays
    let:dateSelectStart
    let:dateSelectMove
    let:dateSelectStop
  >
    <div
      class="calendar-grid no-highlight"
      use:datePickerInteraction
      on:dateSelectStart={dateSelectStart}
      on:dateSelectMove={dateSelectMove}
      on:dateSelectStop={dateSelectStop}
    >
      {#each days as day}
        <Date
          date={day}
          selected={highlightedDays.some((sel) => sel.isSame(day, 'day'))}
        />
      {/each}
    </div>
  </DateSelectionProvider>
</div>

<style>
  .picker-container {
    margin: 0 -0.8em;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: max-content;
  }
</style>