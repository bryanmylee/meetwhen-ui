<script>
  import 'svelte-watch';
  import dayjs from 'dayjs';

  import Date from './Date.svelte';

  // BINDINGS
  // ========
  export let selectedDays = [];
  // Set() does not accept custom comparators. Therefore, use a primitive
  // representation before assigning to actual binding interface.
  let selectedDaysMs = new Set();

  // PROPS
  // =====
  export let selectedMonth;

  // REACTIVE STATE
  // =====
  $: numDays = selectedMonth.daysInMonth();
  $: days = Array.from(Array(numDays).keys())
      .map(inc => selectedMonth.date(1).add(inc, 'day'));

  // STATE
  // =====
  let currStart = null;
  let currEnd = null;
  $: currSelection = getCurrSelection(currStart, currEnd);

  // STATE FUNCTIONS
  // ===============
  function selectStart(event) {
    const { date } = event.detail;
    currStart = date;
    currEnd = date;
  }

  function selectMove(event) {
    const { date } = event.detail;
    currEnd = date;
  }

  function selectStop() {
    for (const day of currSelection) {
      selectedDaysMs.add(+day);
    }
    selectedDays = Array.from(selectedDaysMs).map(ms => dayjs(ms));
    currStart = null;
    currEnd = null;
  }

  function getCurrSelection(start, end) {
    if (start == null) return [];
    if (start.isAfter(end, 'day')) {
      return getCurrSelection(end, start);
    }
    const result = [];
    while (start.isBefore(end, 'day')) {
      result.push(start);
      start = start.add(1, 'day');
    }
    result.push(start);
    return result;
  }
</script>

<div class="calendar-grid">
  {#each days as day}
    <Date
      date={day}
      selected={[...currSelection, ...selectedDays]
          .some(selectedDay => selectedDay.isSame(day, 'day'))}
      on:selectStart={selectStart}
      on:selectMove={selectMove}
      on:selectStop={selectStop}
    />
  {/each}
</div>

<style>
  .calendar-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: max-content;
    padding: 0.5rem;
  }
</style>