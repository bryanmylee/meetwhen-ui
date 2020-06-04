<script>
  import { setContext } from 'svelte';

  import {
    getAreaSelection,
    getUnionOfSelections,
    getIntersectionOfSelections
  } from '../../utils/selection.js';
  import { isSelecting } from '../../stores.js';

  import CalendarIndexColumn from './CalendarIndexColumn.svelte';

  // The defined selections to be bound and exposed as the input data.
  export let selections = [];

  // Any limitation on the selections possible. If null, treated as no limits.
  export let selectionLimits = null;

  // The new selection being made.
  let initialHour = null;
  let newSelection = null;
  // The current selection split into different days.
  $: newSelections = selectionLimits == null
      ? getAreaSelection(newSelection)
      : getIntersectionOfSelections(selectionLimits,
          getAreaSelection(newSelection));
  $: $isSelecting = newSelections.length !== 0;

  function mouseSelectStart(event) {
    const { day, hour } = event.detail;
    initialHour = hour;
    newSelection = ({
      startDay: day,
      startHour: hour,
      endDay: day,
      endHour: hour + 0.25,
    });
  }

  function mouseSelectMove(event) {
    if (initialHour == null && newSelection == null) startSelection(event);
    const { day, hour } = event.detail;
    newSelection = ({
      startDay: newSelection.startDay,
      startHour: initialHour + (hour < initialHour ? 0.25 : 0),
      endDay: day,
      endHour: hour + (hour >= initialHour ? 0.25 : 0),
    });
  }

  function mouseSelectStop() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    initialHour = null;
    newSelection = null;
  }

  function touchSelectStart(event) {
    const { day, hour } = event.detail;
    initialHour = hour;
    newSelection = ({
      startDay: day,
      startHour: hour,
      endDay: day,
      endHour: hour + 0.25,
    });
  }

  setContext('select', ({
    mouseSelectStart,
    mouseSelectMove,
    mouseSelectStop,
    touchSelectStart,
  }));
</script>

<svelte:window on:mouseup={mouseSelectStop} />
<!-- Wrapping the scrollable content in an extra div fixes a position:sticky
bug on Safari 13.1 -->
<div class="body no-highlight">
  <CalendarIndexColumn />
  <!-- Slot for div containing calendar day columns -->
  <slot {newSelections} />
</div>

<style>
  .body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;
    width: -webkit-max-content;
  }
</style>