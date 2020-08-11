<script>
  import dayjs from 'dayjs';

  // BINDINGS
  // ========
  export let selectedDays = [];

  // STATE
  // =====
  let highlightedDays = selectedDays;
  // Track whether the current drag action is a selection or anti-selection
  let isSelection = false;
  let currStart = null;
  let currEnd = null;

  // STATE FUNCTIONS
  // ===============
  function dateSelectStart(event) {
    const { date, selected } = event.detail;
    // If starting a selection from a selected date, treat as an anti-selection.
    isSelection = !selected;
    currStart = date;
    currEnd = date;
    if (isSelection) {
      highlightedDays = getUnionOfDates(selectedDays, getDateRange(currStart, currEnd));
    } else {
      highlightedDays = getDatesWithSubtraction(selectedDays, getDateRange(currStart, currEnd));
    }
  }

  function dateSelectMove(event) {
    const { date } = event.detail;
    currEnd = date;
    if (isSelection) {
      highlightedDays = getUnionOfDates(selectedDays, getDateRange(currStart, currEnd));
    } else {
      highlightedDays = getDatesWithSubtraction(selectedDays, getDateRange(currStart, currEnd));
    }
  }

  function dateSelectStop() {
    selectedDays = highlightedDays;
  }

  function getDateRange(start, end) {
    if (start.isAfter(end)) {
      return getDateRange(end, start);
    }
    const result = [];
    let curr;
    for (curr = start.startOf('day'); !curr.isSame(end, 'date'); curr = curr.add(1, 'day')) {
      result.push(curr);
    }
    result.push(curr);
    return result;
  }

  function getUnionOfDates(...listOfDates) {
    const unionedDatesMs = new Set();
    for (const dates of listOfDates) {
      for (const date of dates) {
        unionedDatesMs.add(+date.startOf('day'));
      }
    }
    return [...unionedDatesMs.keys()].map((k) => dayjs(k));
  }

  function getDatesWithSubtraction(dates, datesToSubtract) {
    const datesSetMs = new Set(dates.map((date) => +date.startOf('day')));
    for (const dateToSubtract of datesToSubtract) {
      datesSetMs.delete(+dateToSubtract.startOf('day'));
    }
    return [...datesSetMs.keys()].map((k) => dayjs(k));
  }
</script>

<slot
  {highlightedDays}
  {dateSelectStart}
  {dateSelectMove}
  {dateSelectStop}
/>