<script>
  import Date from './Date.svelte';

  // BINDINGS
  // ========
  export let selectedDays;

  // PROPS
  // =====
  export let selectedMonth;

  // REACTIVE STATE
  // =====
  $: numDays = selectedMonth.daysInMonth();
  $: firstDayOfWeek = selectedMonth.date(1).day();

  // STATE FUNCTIONS
  // ===============
  function selectStart(event) {
    const { date } = event.detail;
    console.log('start', date.date());
  }

  function selectMove(event) {
    const { date } = event.detail;
    console.log(date.date());
  }

  function selectStop() {
    console.log('stopped');
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