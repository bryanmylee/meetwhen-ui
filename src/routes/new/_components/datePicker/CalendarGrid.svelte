<script>
  import dayjs from 'dayjs';

  import Date from './Date.svelte';

  // BINDINGS
  // ========
  export let selectedDays;
  // Set() does not accept custom comparators. Therefore, use a primitive
  // representation before assigning to actual binding interface.
  let selectedDaysMs = new Set();

  // PROPS
  // =====
  export let selectedMonth;

  // REACTIVE STATE
  // =====
  $: numDays = selectedMonth.daysInMonth();
  $: firstDayOfWeek = selectedMonth.date(1).day();

  // STATE
  // =====
  export let newSelection = {};

  // STATE FUNCTIONS
  // ===============
  function selectStart(event) {
    const { date } = event.detail;
    newSelection = ({
      start: date,
      end: date,
    });
  }

  function selectMove(event) {
    const { date } = event.detail;
    newSelection = ({ ...newSelection,
      end: date,
    });
    updateBinding();
  }

  function selectStop() {
    updateBinding();
    newSelection = null;
  }

  function updateBinding() {
    if (newSelection.start == null) return;
    let { start, end } = newSelection;
    if (start.isAfter(end, 'day')) {
      [start, end] = [end, start];
    }
    let currDate = start;
    while (currDate.isBefore(end, 'day')) {
      selectedDaysMs.add(+currDate);
      currDate = currDate.add(1, 'day');
    }
    selectedDaysMs.add(+currDate);
    // Commit the changes.
    selectedDays = Array.from(selectedDaysMs).map(ms => dayjs(ms));
    selectedDaysMs.clear();
  }
</script>

<div class="calendar-grid">
  <!-- The first grid item can be offset -->
  <Date
    date={selectedMonth.date(1)} {firstDayOfWeek}
    on:selectStart={selectStart}
    on:selectMove={selectMove}
    on:selectStop={selectStop}
  />
  <!-- The remaining dates starting from 2 -->
  {#each Array(numDays - 1) as _, dayIndex}
    <Date
      date={selectedMonth.date(dayIndex + 2)}
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
    gap: 0.5rem;
    padding: 0.5rem;
  }
</style>