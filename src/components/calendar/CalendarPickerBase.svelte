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
  let initialHour = null;
  let newSelection = null;
  // The current selection split into different days.
  export let newSelections = [];
  // Any limitation on the selections possible. If null, treated as no limits.
  export let selectionLimits = null;
  $: newSelections = selectionLimits == null
      ? getAreaSelection(newSelection)
      : getIntersectionOfSelections(selectionLimits,
          getAreaSelection(newSelection));

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

  function tapSelect(event) {
    const { day, startHour, endHour } = event.detail;
    const tapSelection = ({
      start: day.add(startHour, 'hour'),
      end: day.add(endHour, 'hour'),
    });
    selections = getUnionOfSelections([...selections, tapSelection]);
  }

  setContext('select', ({
    mouseSelectStart,
    mouseSelectMove,
    mouseSelectStop,
    tapSelect,
  }));
</script>

<svelte:window on:mouseup={mouseSelectStop} />
<!-- Wrapping the scrollable content in an extra div fixes a position:sticky
bug on Safari 13.1 -->
<div class="body">
  <CalendarIndexColumn />
  <!-- Slot for div containing calendar day columns -->
  <slot />
</div>

<style>
  .body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;
    width: -webkit-max-content;
  }
</style>