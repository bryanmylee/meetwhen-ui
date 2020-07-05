<script>
  import dayjs from 'dayjs';

  import CalendarGrid from './CalendarGrid.svelte';

  let selectedMonth = dayjs();
</script>

<CalendarGrid {selectedMonth} />