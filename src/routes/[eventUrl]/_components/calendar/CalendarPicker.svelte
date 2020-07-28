<script>
  import CalendarSelectionProvider from './CalendarSelectionProvider.svelte';
  import IndexColumn from './IndexColumn.svelte';
  import Column from './Column.svelte';
  import UnavailableColumnOverlay from './UnavailableColumnOverlay.svelte';
  import OtherUsersInterval from './CalendarSelections/OtherUsersInterval.svelte';
  import DefinedSelection from './CalendarSelections/DefinedSelection.svelte';
  import NewSelection from './CalendarSelections/NewSelection.svelte';

  import { selectedUsernames, minUserCountFilter } from '../../stores';
  import { getMergedIntervals, splitIntervalsOnMidnight } from 'src/utils/interval';
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
</script>

<CalendarSelectionProvider
  bind:selections
  selectionLimits={schedule}
  let:newSelections
  let:newSelectStart
  let:newSelectMove
  let:newSelectEnd
>
  <div class="calendar__picker">
    <div class="calendar__body no-highlight">
      <IndexColumn startingDay={daysToShow[0].day}/>
      {#each daysToShow as { day, skipped }}
        <Column
          {day} {skipped}
          on:newSelectStart={newSelectStart}
          on:newSelectMove={newSelectMove}
          on:newSelectEnd={newSelectEnd}
        >
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
</CalendarSelectionProvider>

<style>
  .calendar__picker {
    overflow: scroll;
    scroll-behavior: smooth;
    position: relative;
  }

  .calendar__body {
    position: relative;
    display: flex;
    width: max-content;
  }
</style>