<script>
  import dayjs from 'dayjs';

  import { isCreatingNewSelection } from './stores';
  import { getAreaSelection, getUnionOfSelections, getIntersectionOfSelections, getLowRes } from 'src/utils/selection';
  import { splitIntervalsOnMidnight } from 'src/utils/interval';

  // BINDINGS
  // ========
  export let selections = [];

  // PROPS
  // =====
  export let schedule = [];
  $: columnStart = schedule && schedule.length > 0 && schedule[0].start;

  // STATE
  // =====
  // The new selection being made.
  let newSelection = null;
  let selectAttempts = 0;
  $: isCreatingNewSelection.set(newSelection != null);

  // REACTIVE ATTRIBUTES
  // ===================
  $: newSelections = schedule == null && schedule.length > 0
    ? getLowRes(getAreaSelection(newSelection, schedule))
    : getLowRes(getIntersectionOfSelections(schedule, getAreaSelection(newSelection, schedule)));

  // STATE FUNCTIONS
  // ===============
  function newSelectStart(event) {
    selectAttempts = 0;
    const { dayMs, hour } = event.detail;
    const day = dayjs(dayMs).add(hour, 'hour');
    newSelection = {
      down: day,
      up: day,
    };
  }

  function newSelectMove(event) {
    if (newSelection == null) newSelectStart(event);
    const { dayMs, hour } = event.detail;
    const day = dayjs(dayMs).add(hour, 'hour');
    newSelection = {
      ...newSelection,
      up: day,
    };
  }

  function newSelectStop() {
    if (newSelections.length === 0) return;
    selections = getLowRes(getUnionOfSelections([...selections, ...newSelections]));
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
    selections = splitIntervalsOnMidnight(getUnionOfSelections([
      ...selectionsWithoutResized,
      ...newSelections,
    ]));
    newSelection = null;
  }

  function deleteDefined(event) {
    const { initStart } = event.detail;
    selections = selections.filter((selection) => !selection.start.isSame(initStart, 'minute'));
  }

  function setSelections(draggedSelections) {
    const processedSelections = splitIntervalsOnMidnight(getUnionOfSelections(draggedSelections));
    if (schedule == null) {
      selections = getLowRes(processedSelections);
    } else {
      selections = getLowRes(getIntersectionOfSelections(processedSelections, schedule));
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