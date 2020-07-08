<script>
  import dayjs from 'dayjs';

  import CalendarGrid from './CalendarGrid.svelte';
  import CalendarDates from './CalendarDates.svelte';

  // BINDINGS
  // ========
  export let selectedDays = [];

  // PROPS
  // =====
  export let selectedMonth = dayjs();
</script>

<CalendarDates />
<CalendarGrid
  bind:selectedDays={selectedDays}
  {selectedMonth}
/>