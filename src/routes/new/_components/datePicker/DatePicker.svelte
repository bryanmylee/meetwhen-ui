<script>
  import dayjs from 'dayjs';

  import DatePickerHeader from './DatePickerHeader.svelte';
  import CalendarGrid from './CalendarGrid.svelte';
  import CalendarDates from './CalendarDates.svelte';

  // BINDINGS
  // ========
  export let selectedDays = [];

  // STATE
  // =====
  let selectedMonth = dayjs();
</script>

<div>
  <DatePickerHeader bind:month={selectedMonth} />
  <CalendarDates/>
  <CalendarGrid
    bind:selectedDays={selectedDays}
    {selectedMonth}
  />
</div>

<style>
  div {
    margin: 0 -0.8em;
  }
</style>