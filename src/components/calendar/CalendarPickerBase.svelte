<script>
  import { setContext } from 'svelte';

  import {
    getAreaSelection,
    getUnionOfSelections,
    getIntersectionOfSelections,
  } from 'src/utils/selection';
  import { splitIntervalsOnMidnight } from 'src/utils/interval';
  import { createSelection } from './actions/selection';

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
    const { day, hour } = event.detail;
    initialHour = hour;
    newSelection = {
      startDay: day,
      startHour: hour,
      endDay: day,
      endHour: hour + 0.25,
    };
  }

  function selectMove(event) {
    if (initialHour == null && newSelection == null) selectStart(event);
    const { day, hour } = event.detail;
    const snappedHour = Math.min(hour, 23.75);
    newSelection = {
      startDay: newSelection.startDay,
      startHour: snappedHour < initialHour ? initialHour + 0.25 : initialHour,
      endDay: day,
      endHour: snappedHour >= initialHour ? snappedHour + 0.25 : snappedHour,
    };
  }

  function selectStop() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    initialHour = null;
    newSelection = null;
  }

  function moveSelection(event) {
    const { originalStart, originalEnd, deltaRow, deltaCol } = event.detail;
    const draggedSelections = selections.map((selection) => {
      if (+selection.start !== +originalStart) return selection;
      // Given an event with non-uniform days, we need to determine the new day
      // by its index.
      const dayIndex = daysToShow.findIndex((day) => day.isSame(originalStart, 'day'));
      const newDayIndex = Math.min(Math.max(dayIndex + deltaCol, 0), daysToShow.length - 1);
      const newDay = daysToShow[newDayIndex];
      return {
        start: originalStart
          .year(newDay.year())
          .month(newDay.month())
          .date(newDay.date())
          .add(deltaRow, 'hour'),
        end: originalEnd
          .year(newDay.year())
          .month(newDay.month())
          .date(newDay.date())
          .add(deltaRow, 'hour'),
      };
    });
    setSelections(draggedSelections);
  }

  function resizeSelectionTop(event) {
    const { originalStart, originalEnd, newStart } = event.detail;
    const draggedSelections = selections.map((selection) => {
      if (+selection.start !== +originalStart) return selection;
      return {
        start: newStart,
        end: originalEnd,
      };
    });
    setSelections(draggedSelections);
  }

  function resizeSelectionBottom(event) {
    const { originalStart, newEnd } = event.detail;
    const draggedSelections = selections.map((selection) => {
      if (+selection.start !== +originalStart) return selection;
      return {
        start: originalStart,
        end: newEnd,
      };
    });
    setSelections(draggedSelections);
  }

  function setSelections(draggedSelections) {
    const processedSelections = splitIntervalsOnMidnight(getUnionOfSelections(draggedSelections));
    selections = selectionLimits == null
      ? processedSelections
      : getIntersectionOfSelections(processedSelections, selectionLimits);
  }

  setContext('dragresize', {
    moveSelection,
    resizeSelectionTop,
    resizeSelectionBottom,
  });
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
      class="create-selection__layer"
      use:createSelection={{ daysToShow, selectionEnabled }}
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

  .create-selection__layer {
    position: absolute;
    left: var(--index-col-width);
    top: var(--header-row-height);
    right: 0;
    bottom: calc(var(--row-height) / 2);
    z-index: 2;
    pointer-events: all;
  }
</style>