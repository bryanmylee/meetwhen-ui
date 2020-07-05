<script>
  import { createSelection } from './actions/selection.js';
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
    console.log(date.date());
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
  <!-- MOUSE/TOUCH EVENT CAPTURE LAYER -->
  <div
    class="create-selection__layer"
    use:createSelection={{selectedMonth}}
    on:selectStart={selectStart}
    on:selectMove={selectMove}
    on:selectStop={selectStop}
  />
  <!-- The first grid item can be offset -->
  <Date date={selectedMonth.date(1)} {firstDayOfWeek} />
  <!-- The remaining dates starting from 2 -->
  {#each Array(numDays - 1) as _, dayIndex}
    <Date date={selectedMonth.date(dayIndex + 2)} />
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

  .create-selection__layer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: all;
  }
</style>