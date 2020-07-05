<script>
  import dayjs from 'dayjs';

  import CalendarGrid from './CalendarGrid.svelte';

  // BINDINGS
  // ========
  export let selectedDays = [];

  // PROPS
  // =====
  export let selectedMonth = dayjs();
  $: console.log(selectedDays);
</script>

<CalendarGrid
  bind:selectedDays={selectedDays}
  {selectedMonth}
/>