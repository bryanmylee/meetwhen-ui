<script>
  import {
    getAreaSelection,
    getUnionOfSelections,
    getIntersectionOfSelections
  } from '../../utils/selection.js';
  import { interaction } from './CalendarPickerBase.js';
  import { isSelecting } from '../../stores.js';

  import CalendarIndexColumn from './CalendarIndexColumn.svelte';

  export let daysToShow = [];
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

  function selectStart(event) {
    const { day, hour } = event.detail;
    initialHour = hour;
    newSelection = ({
      startDay: day,
      startHour: hour,
      endDay: day,
      endHour: hour + 0.25,
    });
  }

  function selectMove(event) {
    if (initialHour == null && newSelection == null) startSelection(event);
    const { day, hour } = event.detail;
    newSelection = ({
      startDay: newSelection.startDay,
      startHour: initialHour + (hour < initialHour ? 0.25 : 0),
      endDay: day,
      endHour: hour + (hour >= initialHour ? 0.25 : 0),
    });
  }

  function selectStop() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    initialHour = null;
    newSelection = null;
  }
</script>

<svelte:window on:mouseup={selectStop} />
<!-- Wrapping the scrollable content in an extra div fixes a position:sticky
bug on Safari 13.1 -->
<div
  class="body no-highlight"
  class:disable-touch-scroll={$isSelecting}
>
  <div
    class="interaction-layer"
    use:interaction={{daysToShow}}
    on:selectStart={selectStart}
    on:selectMove={selectMove}
    on:selectStop={selectStop}
  />
  <CalendarIndexColumn />
  <!-- Slot for div containing calendar day columns -->
  <slot {newSelections} />
</div>

<style>
  .body {
    position: relative;
    display: flex;
    flex-direction: row;
    width: -moz-max-content;
    width: -webkit-max-content;
  }

  .disable-touch-scroll {
    touch-action: none;
  }

  .interaction-layer {
    position: absolute;
    left: var(--index-col-width);
    top: var(--header-row-height);
    right: 0;
    bottom: calc(var(--row-height) / 2);
    z-index: 2;
    pointer-events: all;
  }
</style>