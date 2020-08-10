<script>
  import dayjs from 'dayjs';

  import { isCreatingNewSelection } from './stores';
  import { getAreaSelection, getUnionOfSelections, getIntersectionOfSelections, getLowRes } from 'src/utils/selection';

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
    const dayHour = dayjs(dayMs).add(hour, 'hour');
    newSelection = {
      down: dayHour,
      up: dayHour,
    };
  }

  function newSelectMove(event) {
    if (newSelection == null) newSelectStart(event);
    const { dayMs, hour } = event.detail;
    const dayHour = dayjs(dayMs).add(hour, 'hour');
    newSelection = {
      ...newSelection,
      up: dayHour,
    };
  }

  function newSelectStop() {
    if (newSelections.length === 0) return;
    selections = getLowRes(getUnionOfSelections([...selections, ...newSelections]));
    newSelection = null;
  }

  function moveDefinedStop(event) {
    const { initStartDayHour, newStartDayHour, newEndDayHour } = event.detail;
    const draggedSelections = selections.map((selection) => {
      if (!selection.start.isSame(initStartDayHour, 'minute')) {
        return selection;
      }
      return {
        start: newStartDayHour,
        end: newEndDayHour,
      };
    });
    setSelections(draggedSelections);
  }

  function resizeDefinedStart(event) {
    const { downDayHour, upDayHour } = event.detail;

    newSelection = {
      down: downDayHour,
      up: upDayHour,
    };
  }

  function resizeDefinedMove(event) {
    newSelectMove(event);
  }

  function resizeDefinedStop(event) {
    const { initStartDayHour } = event.detail;
    if (newSelections.length === 0) return;
    const selectionsWithoutResized = selections.filter((selection) => !selection.start.isSame(initStartDayHour, 'minute'));
    selections = getUnionOfSelections([
      ...selectionsWithoutResized,
      ...newSelections,
    ]);
    newSelection = null;
  }

  function deleteDefined(event) {
    const { initStartDayHour } = event.detail;
    selections = selections.filter((selection) => !selection.start.isSame(initStartDayHour, 'minute'));
  }

  function setSelections(draggedSelections) {
    const processedSelections = getUnionOfSelections(draggedSelections);
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