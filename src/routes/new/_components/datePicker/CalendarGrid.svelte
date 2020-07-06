<script>
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
  // Track whether the current drag action is a selection
  let isSelecting = false;
  let currStart = null;
  let currEnd = null;
  $: currSelection = getCurrSelection(currStart, currEnd);

  // STATE FUNCTIONS
  // ===============
  function dragStart(event) {
    const { date, selecting } = event.detail;
    isSelecting = selecting;
    currStart = date;
    currEnd = date;
  }

  function dragMove(event) {
    const { date } = event.detail;
    currEnd = date;
  }

  function dragStop() {
    if (isSelecting) {
      for (const day of currSelection) {
        selectedDaysMs.add(+day);
      }
    } else {
      for (const day of currSelection) {
        selectedDaysMs.delete(+day);
      }
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

  /**
   * Combines the selected days with the current selection being made. If
   * selecting, merge the two selections. Otherwise, subtract the current
   * selection from the selected days.
   */
  function getCombinedSelection(currSelection, selectedDays) {
    if (isSelecting) {
      return [...currSelection, ...selectedDays];
    } else {
      return selectedDays.filter(day =>
          !currSelection.map(curr => +curr).includes(+day));
    }
  }
</script>

<div class="calendar-grid">
  {#each days as day}
    <Date
      date={day}
      selected={getCombinedSelection(currSelection, selectedDays)
          .some(selectedDay => selectedDay.isSame(day, 'day'))}
      on:dragStart={dragStart}
      on:dragMove={dragMove}
      on:dragStop={dragStop}
    />
  {/each}
</div>

<style>
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: max-content;
  }
</style>