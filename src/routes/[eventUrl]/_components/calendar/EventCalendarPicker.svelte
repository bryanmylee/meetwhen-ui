<svelte:options immutable={true}/>
<script>
  import { getMergedIntervals, splitIntervalsOnMidnight, } from 'src/utils/interval.js';
  import { isSelecting } from './stores.js';
  import { getFilteredUserIntervalsByUsername, getMinMaxUsernames, getDaysToShowWithSkip } from './EventCalendarPicker.js';
  import { formEnum, form, selectedUsernames, minUserCountFilter } from '../../stores.js';

  import CalendarPickerBase from 'src/components/calendar/CalendarPickerBase.svelte';
  import CalendarDayColumn from 'src/components/calendar/CalendarDayColumn.svelte';
  import UnavailableColumnOverlay from './UnavailableColumnOverlay.svelte';
  import OtherUsersSelection from './OtherUsersSelection.svelte';
  import DefinedSelection from './DefinedSelection.svelte';
  import NewSelection from './NewSelection.svelte';

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
  $: eventIntervalsSplitOnMidnight = splitIntervalsOnMidnight(eventIntervals);
  // Filtered user intervals based on selected usernames.
  $: filteredUserIntervalsByUsername = getFilteredUserIntervalsByUsername($selectedUsernames, userIntervalsByUsername);
  // User intervals with grouped usernames.
  $: userIntervalsByTime = splitIntervalsOnMidnight(getMergedIntervals(filteredUserIntervalsByUsername));
  // User intervals with minimum number of users.
  $: intervalsWithMinUser = userIntervalsByTime.filter(interval => interval.usernames.length >= $minUserCountFilter);
  // The minimum and maximum number of usernames in any given interval.
  $: [ minUsernameCount, maxUsernameCount ] = getMinMaxUsernames(userIntervalsByTime);
  // The days containing all event intervals and whether the day sequentially
  // follows the previous day.
  $: daysToShowWithSkip = getDaysToShowWithSkip(eventIntervalsSplitOnMidnight);
  $: isCollapsed = $form === formEnum.JOINING || $form === formEnum.EDITING;
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:isSelecting={$isSelecting}
  daysToShow={daysToShowWithSkip.map(dws => dws.day)}
  selectionLimits={eventIntervals}
  selectionEnabled={$form === formEnum.JOINING || $form === formEnum.EDITING}
  let:newSelections
>
  <!-- COLUMNS -->
  {#each daysToShowWithSkip as { day, skipped }}
    <CalendarDayColumn {day} {skipped} >
      <!-- DISABLED INTERVALS -->
      <UnavailableColumnOverlay
        eventIntervals={eventIntervalsSplitOnMidnight.filter(interval =>
            interval.start.isSame(day, 'day')
        )}
      />
      <!-- OTHER USER SELECTIONS -->
      {#each intervalsWithMinUser.filter(interval => interval.start.isSame(day, 'date'))
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
      {#each selections.filter(selection => selection.start.isSame(day, 'date'))
          as selection (`${+selection.start}-${+selection.end}`)}
        <DefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections.filter(selection => selection.start.isSame(day, 'date'))
          as selection}
        <NewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>