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
  let newSelection = null;
  let selectAttempts = 0;
  $: {
    $isCreatingNewSelection = newSelection != null;
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
    newSelection = {
      downDay: day,
      downHour: hour,
      upDay: day,
      upHour: hour,
    };
  }

  function newSelectMove(event) {
    if (newSelection == null) newSelectStart(event);
    const { dayMs, hour } = event.detail;
    const day = dayjs(dayMs);
    newSelection = {
      ...newSelection,
      upDay: day,
      upHour: hour,
    };
  }

  function newSelectStop() {
    if (newSelections.length === 0) return;
    selections = getUnionOfSelections([...selections, ...newSelections]);
    newSelection = null;
  }

  function moveDefinedStop(event) {
    const { initStart, newStart, newEnd } = event.detail;
    const draggedSelections = selections.map((selection) => {
      if (!selection.start.isSame(initStart, 'minute')) {
        return selection;
      }
      return {
        start: newStart,
        end: newEnd,
      };
    });
    setSelections(draggedSelections);
  }

  function resizeDefinedStart(event) {
    const {
      // To set the new selection to a predefined size.
      newSelectionStartDay,
      newSelectionStartHour,
      newSelectionEndDay,
      newSelectionEndHour,
    } = event.detail;

    newSelection = {
      downDay: newSelectionStartDay,
      downHour: newSelectionStartHour,
      upDay: newSelectionEndDay,
      upHour: newSelectionEndHour,
    };
  }

  function resizeDefinedMove(event) {
    newSelectMove(event);
  }

  function resizeDefinedStop(event) {
    const { initStart } = event.detail;
    if (newSelections.length === 0) return;
    const selectionsWithoutResized = selections.filter((selection) => !selection.start.isSame(initStart, 'minute'));
    selections = getUnionOfSelections([
      ...selectionsWithoutResized,
      ...newSelections,
    ]);
    newSelection = null;
  }

  function deleteDefined(event) {
    const { initStart } = event.detail;
    selections = selections.filter((selection) => !selection.start.isSame(initStart, 'minute'));
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
  {moveDefinedStop}
  {resizeDefinedStart}
  {resizeDefinedMove}
  {resizeDefinedStop}
  {deleteDefined}
/>