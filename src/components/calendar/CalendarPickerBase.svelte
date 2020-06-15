<script>
  import {
    getAreaSelection,
    getUnionOfSelections,
    getIntersectionOfSelections
  } from 'src/utils/selection.js';
  import { interaction } from './CalendarPickerBase.js';

  import CalendarIndexColumn from './CalendarIndexColumn.svelte';

  // BINDINGS
  // ========
  export let selections = [];
  export let isSelecting;

  // PROPS
  // =====
  export let daysToShow = [];
  // Any limitation on the selections possible. If null, treated as no limits.
  export let selectionLimits = null;
  export let selectionEnabled = true;

  // STATE
  // =====
  // The new selection being made.
  let initialHour = null;
  let newSelection = null;

  // REACTIVE ATTRIBUTES
  // ===================
  // The current selection split into different days.
  $: newSelections = selectionLimits == null
      ? getAreaSelection(newSelection)
      : getIntersectionOfSelections(selectionLimits,
          getAreaSelection(newSelection));
  $: isSelecting = newSelections.length !== 0;

  // STATE FUNCTIONS
  // ===============
  function selectStart(event) {
    if (!selectionEnabled) return;
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
    let { day, hour } = event.detail;
    hour = Math.min(hour, 23.75);
    newSelection = ({
      startDay: newSelection.startDay,
      startHour: hour < initialHour ? initialHour + 0.25 : initialHour,
      endDay: day,
      endHour: hour >= initialHour ? hour + 0.25 : hour,
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
<div class="picker">
  <div
    class="body no-highlight"
    class:disable-touch-scroll={isSelecting}
  >
    <!-- MOUSE/TOUCH EVENT CAPTURE LAYER -->
    <div
      class="interaction-layer"
      use:interaction={{daysToShow}}
      on:selectStart={selectStart}
      on:selectMove={selectMove}
      on:selectStop={selectStop}
    />
    <CalendarIndexColumn startingDay={daysToShow[0]}/>
    <!-- Slot for div containing calendar day columns -->
    <slot {newSelections} />
  </div>
</div>

<style>
  .picker {
    overflow: scroll;
    scroll-behavior: smooth;
  }

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