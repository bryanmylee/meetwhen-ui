<script>
  import dayjs from 'dayjs';
  import isBetween from 'dayjs/plugin/isBetween';

  import CalendarSelectionProvider from './CalendarSelectionProvider.svelte';
  import IndexColumn from './columns/IndexColumn.svelte';
  import Column from './columns/Column.svelte';
  import OtherUsersInterval from './selections/OtherUsersInterval.svelte';
  import DefinedSelection from './selections/DefinedSelection.svelte';
  import NewSelection from './selections/NewSelection.svelte';
  import TrashTarget from './trashTarget/TrashTarget.svelte';
  import ZoomButtons from './zoomButtons/ZoomButtons.svelte';

  import calendarInteraction from './actions/calendarInteraction';
  import { user } from 'src/stores';
  import { calendarSelectionEnabled, dragDropState, dragDropEnum } from './stores';
  import { selectedUsernames, minUserCountFilter, form, formEnum } from '../../_stores';
  import { getMergedIntervals } from 'src/utils/interval';
  import { FRAME_DURATION } from 'src/utils/nextFrame';
  import { getFilteredUserSchedulesByUsername, getUserSchedulesWithoutUser, getTimeIntervalsWithSkip, getMinMaxUsernames, getScheduleWithSkip } from './utils';

  dayjs.extend(isBetween);

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

  function dismissOtherUsersInterval() {
    if (selectedOthers != null) {
      selectedOthers = null;
    }
  }

  // REACTIVE ATTRIBUTES
  // ===================
  // The days containing all event intervals and whether the day sequentially
  // follows the previous day.
  $: scheduleWithSkip = getScheduleWithSkip(schedule);
  $: startingDay = scheduleWithSkip[0].start;

  // Filtered user intervals based on selected usernames.
  $: filteredUserSchedules = getFilteredUserSchedulesByUsername(
    $selectedUsernames, userSchedules,
  );
  $: userSchedulesWithoutMe = getUserSchedulesWithoutUser(userSchedules, $user);
  // Time intervals with grouped usernames.
  $: timeIntervalsWithUsers = getMergedIntervals(
    editing ? userSchedulesWithoutMe : filteredUserSchedules,
  );
  // Time intervals with minimum number of users.
  $: timeIntervalsWithMinUsers = timeIntervalsWithUsers
    .filter((interval) => interval.usernames.length >= $minUserCountFilter);
  // Time intervals with data on previous and next interval.
  $: timeIntervalsWithMinUsersWithSkip = getTimeIntervalsWithSkip(timeIntervalsWithMinUsers);
  // The minimum and maximum number of usernames in any given interval.
  $: [minUsers, maxUsers] = getMinMaxUsernames(timeIntervalsWithUsers);

  // Workaround for bug where store update does not trigger action or child component updates.
  let enabled = false;
  $: {
    setTimeout(() => enabled = $calendarSelectionEnabled, FRAME_DURATION);
  }
  let editing = false;
  $: {
    setTimeout(() => editing = $form === formEnum.EDITING, FRAME_DURATION);
  }
</script>

<CalendarSelectionProvider
  bind:selections
  {schedule}
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
        <IndexColumn start={schedule[0].start} end={schedule[0].end} />

        {#each scheduleWithSkip as { start, end, skipped }, columnIndex}
          <Column {skipped} {start} {end} >

            {#each timeIntervalsWithMinUsersWithSkip
              .filter((i) => i.start.isBetween(start, start.add(24, 'hour'), null, '[)'))
            as interval, index (`${+interval.start}-${+interval.end}`)}
              <OtherUsersInterval
                columnStart={start}
                {...interval}
                {minUsers}
                {maxUsers}
                isFirst={index === 0 && columnIndex === 0}
                on:select={selectOtherUsersInterval}
                on:dismiss={dismissOtherUsersInterval}
                isSelected={selectedOthers && selectedOthers.start === interval.start}
              />
            {/each}

            {#each selections
              .filter((s) => s.start.isBetween(start, start.add(24, 'hour'), null, '[)'))
            as selection (`${+selection.start}-${+selection.end}`)}
              <DefinedSelection columnStart={start} {...selection} />
            {/each}

            {#each newSelections
              .filter((s) => s.start.isBetween(start, start.add(24, 'hour'), null, '[)'))
            as selection}
              <NewSelection columnStart={start} {...selection} />
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
    transition: font-size 200ms ease-out,
                padding 200ms ease-out,
                min-width 200ms ease-out;
  }
</style>