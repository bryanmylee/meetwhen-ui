<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import { getMergedIntervals, splitIntervalsOnMidnight, } from 'src/utils/interval.js';
  import { isSelecting } from './stores.js';
  import { formEnum, form, selectedUsernames } from '../../stores.js';

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
  export let isCollapsed = false;

  // REACTIVE ATTRIBUTES
  // ===================
  $: eventIntervalsSplitOnMidnight = splitIntervalsOnMidnight(eventIntervals);

  // Filtered user intervals based on selected usernames.
  $: filteredUserIntervalsByUsername = $selectedUsernames.length === 0
      ? userIntervalsByUsername
      : Object.keys(userIntervalsByUsername)
          .filter(username => $selectedUsernames.includes(username))
          .reduce((obj, username) => ({
            ...obj,
            [username]: userIntervalsByUsername[username],
          }), {});
  // User intervals with grouped usernames.
  $: userIntervalsByTime
      = splitIntervalsOnMidnight(getMergedIntervals(filteredUserIntervalsByUsername));

  // The maximum number of usernames in any given interval.
  $: maxUsernameCount = userIntervalsByTime.reduce((max, interval) => {
    const { length } = interval.usernames;
    return max >= length ? max : length;
  }, 0);

  // The days containing all event intervals.
  $: daysToShow = eventIntervalsSplitOnMidnight.reduce((days, interval) => {
    const { length } = days;
    if (length === 0) return [ interval.start.startOf('day') ];
    if (days[length - 1].isSame(interval.start, 'day')) return days;
    return [ ...days, interval.start.startOf('day') ];
  }, []);
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:isSelecting={$isSelecting}
  {daysToShow}
  selectionLimits={eventIntervals}
  selectionDisabled={$form !== formEnum.JOINING}
  let:newSelections
>
  <!-- COLUMNS -->
  {#each daysToShow as day}
    <CalendarDayColumn {day} >
      <!-- DISABLED INTERVALS -->
      <UnavailableColumnOverlay
        eventIntervals={eventIntervalsSplitOnMidnight.filter((interval) =>
            interval.start.isSame(day, 'day')
        )}
      />
      <!-- OTHER USER SELECTIONS -->
      {#each userIntervalsByTime.filter((interval) =>
          interval.start.isSame(day, 'date'))
          as interval (`${+interval.start}-${+interval.end}`)}
        <OtherUsersSelection {...interval} {maxUsernameCount} {isCollapsed} />
      {/each}
      <!-- DEFINED SELECTIONS -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <DefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <NewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>