<script>
  import CalendarSelectionProvider from './CalendarSelectionProvider.svelte';
  import CalendarIndexColumn from './CalendarIndexColumn.svelte';
  import CalendarColumn from './CalendarColumn.svelte';
  import UnavailableColumnOverlay from './UnavailableColumnOverlay.svelte';
  import OtherUsersSelection from './CalendarSelections/OtherUsersSelection.svelte';
  import DefinedSelection from './CalendarSelections/DefinedSelection.svelte';
  import NewSelection from './CalendarSelections/NewSelection.svelte';

  import { getMergedIntervals, splitIntervalsOnMidnight } from 'src/utils/interval';
  import { formEnum, form, selectedUsernames, minUserCountFilter } from '../../stores';
  import { getFilteredUserIntervalsByUsername, getTimeIntervalsWithSkip, getMinMaxUsernames, getDaysToShowWithSkip } from './EventCalendarPicker';

  // BINDINGS
  // ========
  export let selections = [];

  // PROPS
  // =====
  export let schedule = [];
  export let userSchedules = {};

  // REACTIVE ATTRIBUTES
  // ===================
  $: selectionEnabled = $form === formEnum.JOINING || $form === formEnum.EDITING;
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
  <div class="picker">
    <div class="body no-highlight">
      <CalendarIndexColumn startingDay={daysToShow[0].day}/>
      {#each daysToShow as { day, skipped }}
        <CalendarColumn
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
            <OtherUsersSelection
              {...interval}
              {minUsers}
              {maxUsers}
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

        </CalendarColumn>
      {/each}
    </div>
  </div>
</CalendarSelectionProvider>

<style>
  .picker {
    overflow: scroll;
    scroll-behavior: smooth;
    position: relative;
  }

  .body {
    position: relative;
    display: flex;
    width: 100%;
  }
</style>