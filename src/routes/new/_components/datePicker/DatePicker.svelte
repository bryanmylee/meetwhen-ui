<script>
  import dayjs from 'dayjs';

  import CalendarGrid from './CalendarGrid.svelte';

  let selectedMonth = dayjs();
  let selectedDays = [];
</script>

<CalendarGrid
  bind:selectedDays={selectedDays}
  {selectedMonth}
/>