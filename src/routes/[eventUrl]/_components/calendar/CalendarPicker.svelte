<script>
  import CalendarSelectionProvider from './CalendarSelectionProvider.svelte';
  import IndexColumn from './columns/IndexColumn.svelte';
  import Column from './columns/Column.svelte';
  import UnavailableColumnOverlay from './UnavailableColumnOverlay.svelte';
  import OtherUsersInterval from './selections/OtherUsersInterval.svelte';
  import DefinedSelection from './selections/DefinedSelection.svelte';
  import NewSelection from './selections/NewSelection.svelte';
  import TrashTarget from './trashTarget/TrashTarget.svelte';
  import ZoomButtons from './zoomButtons/ZoomButtons.svelte';

  import calendarInteraction from './actions/calendarInteraction';
  import { autoScrollSelf } from './actions/autoScroll';
  import { calendarSelectionEnabled, dragDropState, dragDropEnum } from './stores';
  import { selectedUsernames, minUserCountFilter } from '../../stores';
  import { getMergedIntervals, splitIntervalsOnMidnight } from 'src/utils/interval';
  import { FRAME_DURATION } from 'src/utils/nextFrame';
  import { getFilteredUserIntervalsByUsername, getTimeIntervalsWithSkip, getMinMaxUsernames, getDaysToShowWithSkip } from './utils';

  // BINDINGS
  // ========
  export let selections = [];

  // PROPS
  // =====
  export let schedule = [];
  export let userSchedules = {};

  // STATE
  // =====
  let selectedOthers = null;
  let size = 16;

  // STATE FUNCTIONS
  // ===============
  function selectOtherUsersInterval(event) {
    const interval = event.detail;
    if (selectedOthers && selectedOthers.start === interval.start) {
      selectedOthers = null;
    } else {
      selectedOthers = interval;
    }
  }

  // REACTIVE ATTRIBUTES
  // ===================
  $: earliestHour = schedule && schedule.length !== 0 ? schedule[0].start.hour() : 0;
  $: intervalsSplitOnMidnight = splitIntervalsOnMidnight(schedule);
  // Filtered user intervals based on selected usernames.
  $: filteredUserSchedules = getFilteredUserIntervalsByUsername(
    $selectedUsernames, userSchedules,
  );
  // Time intervals with grouped usernames.
  $: timeIntervalsWithUsers = splitIntervalsOnMidnight(
    getMergedIntervals(filteredUserSchedules),
  );
  // Time intervals with minimum number of users.
  $: timeIntervalsWithMinUsers = timeIntervalsWithUsers
    .filter((interval) => interval.usernames.length >= $minUserCountFilter);
  // Time intervals with data on previous and next interval.
  $: timeIntervalsWithMinUsersWithSkip = getTimeIntervalsWithSkip(timeIntervalsWithMinUsers);
  // The minimum and maximum number of usernames in any given interval.
  $: [minUsers, maxUsers] = getMinMaxUsernames(timeIntervalsWithUsers);
  // The days containing all event intervals and whether the day sequentially
  // follows the previous day.
  $: daysToShow = getDaysToShowWithSkip(intervalsSplitOnMidnight);
  $: startingDay = daysToShow.length !== 0 ? daysToShow[0].day : null;

  // Workaround for bug where store update does not trigger action update.
  let enabled;
  $: {
    setTimeout(() => enabled = $calendarSelectionEnabled, FRAME_DURATION);
  }
</script>

<CalendarSelectionProvider
  bind:selections
  selectionLimits={schedule}
  let:newSelections
  let:newSelectStart
  let:newSelectMove
  let:newSelectStop
  let:moveDefinedStop
  let:resizeDefinedStart
  let:resizeDefinedMove
  let:resizeDefinedStop
  let:deleteDefined
>
  <div class="calendar__picker">
    <div class="calendar__scroll-container">
      <div
        class="calendar__body no-highlight"
        use:calendarInteraction={{ enabled }}
        use:autoScrollSelf={{ hour: earliestHour }}
        on:newSelectStart={newSelectStart}
        on:newSelectMove={newSelectMove}
        on:newSelectStop={newSelectStop}
        on:moveDefinedStop={moveDefinedStop}
        on:resizeDefinedStart={resizeDefinedStart}
        on:resizeDefinedMove={resizeDefinedMove}
        on:resizeDefinedStop={resizeDefinedStop}
        on:deleteDefined={deleteDefined}
        style="font-size: {size}px"
      >
        <IndexColumn />

        {#each daysToShow as { day, skipped }}
          <Column {day} {skipped}>

            <UnavailableColumnOverlay
              eventIntervals={intervalsSplitOnMidnight
                .filter((interval) => interval.start.isSame(day, 'day'))
              }
            />

            {#each timeIntervalsWithMinUsersWithSkip
              .filter((i) => i.start.isSame(day, 'date'))
            as interval (`${+interval.start}-${+interval.end}`)}
              <OtherUsersInterval
                {...interval}
                {minUsers}
                {maxUsers}
                on:select={selectOtherUsersInterval}
                isSelected={selectedOthers && selectedOthers.start === interval.start}
              />
            {/each}

            {#each selections
              .filter((s) => s.start.isSame(day, 'date'))
            as selection (`${+selection.start}-${+selection.end}`)}
              <DefinedSelection {...selection} />
            {/each}

            {#each newSelections
              .filter((s) => s.start.isSame(day, 'date'))
            as selection}
              <NewSelection {...selection} />
            {/each}

          </Column>
        {/each}
      </div>
    </div>

    <!-- MONTH LABEL -->
    <div
      class="month-label"
      style="font-size: {size}px"
    >
      {startingDay == null ? 'NIL' : startingDay.format('MMM')}
    </div>

    <TrashTarget show={$dragDropState === dragDropEnum.MOVING} />
    <ZoomButtons bind:size />
  </div>
</CalendarSelectionProvider>

<style>
  .calendar__picker {
    flex: 1;
    /* For absolutely positioned elements */
    position: relative;
    /* To set the height of the scroll container */
    height: 100%;
    min-height: 0;
  }

  .calendar__scroll-container {
    height: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
  }

  .calendar__body {
    position: relative;
    display: flex;
    width: fit-content;
    min-width: 100%;
    transition: font-size 200ms ease-out;
  }

  .month-label {
    position: absolute;
    left: -1px;
    top: -1px;
    min-width: var(--index-col-width);
    z-index: 22;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    padding: 0.5em;
    border-bottom: 1px var(--grey-400) solid;
    background-color: var(--bg);
    transition: all 200ms ease-out;
  }
</style>