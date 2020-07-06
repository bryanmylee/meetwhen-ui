<script>
  import dayjs from 'dayjs';

  import CalendarGrid from './CalendarGrid.svelte';
  import CalendarHeader from './CalendarHeader.svelte';

  // BINDINGS
  // ========
  export let selectedDays = [];

  // PROPS
  // =====
  export let selectedMonth = dayjs();
  $: console.log(selectedDays);
</script>

<CalendarHeader />
<CalendarGrid
  bind:selectedDays={selectedDays}
  {selectedMonth}
/>