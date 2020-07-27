<script>
  import dayjs from 'dayjs';

  import MonthPicker from './MonthPicker.svelte';
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
  <MonthPicker bind:month={selectedMonth} />
  <CalendarDates/>
  <CalendarGrid
    bind:selectedDays={selectedDays}
    {selectedMonth}
  />
</div>

<style>
  div {
    margin: 0 -0.8rem;
  }
</style>