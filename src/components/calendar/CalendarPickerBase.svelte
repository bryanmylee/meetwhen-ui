<script>
  import { setContext } from 'svelte';
  import {
    getMultiDaySelection,
    getUnionOfSelections,
    getIntersectionOfSelections
  } from '../../utils/selections.js';

  import CalendarIndexColumn from './CalendarIndexColumn.svelte';

  // The defined selections.
  export let selections = [];
  // The new selection being made.
  let newSelection = null;
  // The current selection split into different days.
  export let newSelections = [];
  // Any limitation on the selections possible. If null, treated as no limits.
  export let selectionLimits = null;
  $: newSelections = selectionLimits == null
      ? getMultiDaySelection(newSelection)
      : getIntersectionOfSelections(selectionLimits,
          getMultiDaySelection(newSelection));

  function startSelection(event) {
    const { datetime } = event.detail;
    newSelection = ({
      start: datetime,
      // datetime represents the start of the cell.
      // Add 15 minutes to account for the time in the last cell.
      end: datetime.add(15, 'minute'),
    });
  }

  function gridDrag(event) {
    const { datetime } = event.detail;
    // datetime represents the start of the cell.
    // Add 15 minutes to account for the time in the last cell.
    newSelection = ({ ...newSelection,
      end: datetime.add(15, 'minute'),
    });
  }

  function stopSelection() {
    if (!newSelection || !newSelection.start || !newSelection.end) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    newSelection = null;
  }

  setContext('select', ({
    startSelection,
    gridDrag,
    stopSelection,
  }));
</script>

<!-- Wrapping the scrollable content in an extra div fixes a position:sticky
bug on Safari 13.1 -->
<div class="body">
  <CalendarIndexColumn />
  <slot />
</div>

<style>
  :root {
    --index-col-width: 4rem;
    --header-row-height: 2rem;
    --col-width: 6rem;
    --row-height: 3rem;
  }

  .body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;
    width: -webkit-max-content;
  }
</style>