<script>
  import { getAreaSelection, getUnionOfSelections, getIntersectionOfSelections } from 'src/utils/selection';

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
    const { day, hour } = event.detail;
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
    const { day, hour } = event.detail;
    const clippedHour = Math.min(hour, 23.75);
    newSelection = {
      startDay: newSelection.startDay,
      startHour: clippedHour < initialHour ? initialHour + 0.25 : initialHour,
      endDay: day,
      endHour: clippedHour >= initialHour ? clippedHour + 0.25 : clippedHour,
    };
  }

  function newSelectEnd() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    initialHour = null;
    newSelection = null;
  }
</script>

<slot
  {newSelections}
  {newSelectStart}
  {newSelectMove}
  {newSelectEnd}
/>