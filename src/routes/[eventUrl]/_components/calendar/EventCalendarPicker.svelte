<svelte:options immutable={true}/>
<script>
  import { getMergedIntervals, splitIntervalsOnMidnight } from 'src/utils/interval';
  import { isSelecting } from './stores';
  import { formEnum, form, selectedUsernames, minUserCountFilter } from '../../stores';
  import { getFilteredUserIntervalsByUsername, getTimeIntervalsWithSkip, getMinMaxUsernames, getDaysToShowWithSkip } from './EventCalendarPicker';

  import CalendarPickerBase from './CalendarPickerBase.svelte';
  import CalendarDayColumn from './CalendarDayColumn.svelte';
  import UnavailableColumnOverlay from './UnavailableColumnOverlay.svelte';
  import OtherUsersSelection from './CalendarSelections/OtherUsersInterval.svelte';
  import DefinedSelection from './CalendarSelections/DefinedSelection.svelte';
  import NewSelection from './CalendarSelections/NewSelection.svelte';

  // BINDINGS
  // ========
  export let selections = [];

  // PROPS
  // =====
  export let eventIntervals = [];
  export let userIntervalsByUsername = {};

  // STATE
  // =====
  export let selectedInterval = null;

  // EVENT LISTENERS
  // ===============
  function selectInterval(event) {
    const interval = event.detail;
    if (selectedInterval && selectedInterval.start === interval.start) {
      selectedInterval = null;
    } else {
      selectedInterval = interval;
    }
  }

  // REACTIVE ATTRIBUTES
  // ===================
  $: selectionEnabled = $form === formEnum.JOINING || $form === formEnum.EDITING;
  $: eventIntervalsSplitOnMidnight = splitIntervalsOnMidnight(eventIntervals);
  // Filtered user intervals based on selected usernames.
  $: filteredUserIntervalsByUsername = getFilteredUserIntervalsByUsername(
    $selectedUsernames, userIntervalsByUsername,
  );
  // Time intervals with grouped usernames.
  $: timeIntervalsWithUsers = splitIntervalsOnMidnight(
    getMergedIntervals(filteredUserIntervalsByUsername),
  );
  // Time intervals with minimum number of users.
  $: timeIntervalsWithMinUsers = timeIntervalsWithUsers
    .filter((interval) => interval.usernames.length >= $minUserCountFilter);
  // Time intervals with data on previous and next interval.
  $: timeIntervalsWithMinUsersWithSkip = getTimeIntervalsWithSkip(timeIntervalsWithMinUsers);
  // The minimum and maximum number of usernames in any given interval.
  $: [minUsernameCount, maxUsernameCount] = getMinMaxUsernames(timeIntervalsWithUsers);
  // The days containing all event intervals and whether the day sequentially
  // follows the previous day.
  $: daysToShowWithSkip = getDaysToShowWithSkip(eventIntervalsSplitOnMidnight);
  $: isCollapsed = $form === formEnum.JOINING || $form === formEnum.EDITING;
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:isSelecting={$isSelecting}
  on:showLongTouchHint
  daysToShow={daysToShowWithSkip.map((dws) => dws.day)}
  selectionLimits={eventIntervals}
  {selectionEnabled}
  let:newSelections
>
  <!-- COLUMNS -->
  {#each daysToShowWithSkip as { day, skipped }}
    <CalendarDayColumn {day} {skipped} action={createSelection} >
      <!-- DISABLED INTERVALS -->
      <UnavailableColumnOverlay
        eventIntervals={eventIntervalsSplitOnMidnight
          .filter((inv) => inv.start.isSame(day, 'day'))
        }
      />
      <!-- OTHER USER SELECTIONS -->
      {#each timeIntervalsWithMinUsersWithSkip
        .filter((inv) => inv.start.isSame(day, 'date'))
        as interval (`${+interval.start}-${+interval.end}`)}
        <OtherUsersSelection
          on:selectInterval={selectInterval}
          {...interval}
          {minUsernameCount}
          {maxUsernameCount}
          {isCollapsed}
          isSelected={selectedInterval && selectedInterval.start === interval.start}
        />
      {/each}
      <!-- DEFINED SELECTIONS -->
      {#each selections
        .filter((sel) => sel.start.isSame(day, 'date'))
        as selection (`${+selection.start}-${+selection.end}`)}
        <DefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections
        .filter((sel) => sel.start.isSame(day, 'date'))
        as selection}
        <NewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>