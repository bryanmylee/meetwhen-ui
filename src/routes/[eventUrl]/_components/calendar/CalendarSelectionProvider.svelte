<script>
  import dayjs from 'dayjs';

  import { isCreatingNewSelection } from './stores';
  import { getAreaSelection, getUnionOfSelections, getIntersectionOfSelections } from 'src/utils/selection';
  import { splitIntervalsOnMidnight } from 'src/utils/interval';

  // BINDINGS
  // ========
  export let selections = [];

  // PROPS
  // =====
  // Any limitation on the selections possible. If null, treated as no limits.
  export let selectionLimits = null;

  // STATE
  // =====
  // The new selection being made.
  let initialHour = null;
  let newSelection = null;
  let selectAttempts = 0;
  $: {
    $isCreatingNewSelection = newSelection !== null;
  }

  // REACTIVE ATTRIBUTES
  // ===================
  $: newSelections = selectionLimits == null
    ? getAreaSelection(newSelection)
    : getIntersectionOfSelections(selectionLimits,
      getAreaSelection(newSelection));

  // STATE FUNCTIONS
  // ===============
  function newSelectStart(event) {
    selectAttempts = 0;
    const { dayMs, hour } = event.detail;
    const day = dayjs(dayMs);
    initialHour = hour;
    newSelection = {
      startDay: day,
      startHour: hour,
      endDay: day,
      endHour: hour + 0.25,
    };
  }

  function newSelectMove(event) {
    if (initialHour == null && newSelection == null) newSelectStart(event);
    const { dayMs, hour } = event.detail;
    const day = dayjs(dayMs);
    const clippedHour = Math.min(hour, 23.75);
    newSelection = {
      startDay: newSelection.startDay,
      startHour: clippedHour < initialHour ? initialHour + 0.25 : initialHour,
      endDay: day,
      endHour: clippedHour >= initialHour ? clippedHour + 0.25 : clippedHour,
    };
  }

  function newSelectStop() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    initialHour = null;
    newSelection = null;
  }

  function moveSelection(event) {
    const { originalStart, newStart } = event.detail;
    const draggedSelections = selections.map((selection) => {
      if (!selection.start.isSame(originalStart, 'minute')) return selection;
      const deltaMs = newStart - originalStart;
      return {
        start: newStart,
        end: dayjs(selection.end + deltaMs),
      };
    });
    setSelections(draggedSelections);
  }

  function setSelections(draggedSelections) {
    const processedSelections = splitIntervalsOnMidnight(getUnionOfSelections(draggedSelections));
    if (selectionLimits == null) {
      selections = processedSelections;
    } else {
      selections = getIntersectionOfSelections(processedSelections, selectionLimits);
    }
  }
</script>

<slot
  {newSelections}
  {newSelectStart}
  {newSelectMove}
  {newSelectStop}
/>