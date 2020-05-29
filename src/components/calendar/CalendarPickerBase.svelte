<script>
  import { setContext } from 'svelte';
  import {
    getAreaSelection,
    getUnionOfSelections,
    getIntersectionOfSelections
  } from '../../utils/selection.js';

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
      ? getAreaSelection(newSelection)
      : getIntersectionOfSelections(selectionLimits,
          getAreaSelection(newSelection));

  function startSelection(event) {
    const { day, hour } = event.detail;
    newSelection = ({
      startDay: day,
      startHour: hour,
      endDay: day,
      endHour: hour,
    });
  }

  function gridDrag(event) {
    const { day, hour } = event.detail;
    newSelection = ({ ...newSelection,
      endDay: day,
      endHour: hour,
    });
  }

  function stopSelection() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    newSelection = null;
  }

  setContext('select', ({
    startSelection,
    gridDrag,
    stopSelection,
  }));
</script>

<svelte:window on:mouseup={stopSelection} />
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