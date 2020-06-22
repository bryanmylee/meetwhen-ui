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

  // The days containing all event intervals and whether the day sequentially
  // follows the previous day.
  $: daysToShowWithSkip = eventIntervalsSplitOnMidnight.reduce((daysWithSkip, interval) => {
    const { length } = daysWithSkip;
    const newDay = interval.start.startOf('day');
    if (length === 0) return [{ day: newDay, skipped: false }];
    const previousDay = daysWithSkip[length - 1].day;
    if (previousDay.isSame(newDay, 'day')) return daysWithSkip;
    if (previousDay.add(1, 'day').isSame(newDay, 'day')) {
      return [ ...daysWithSkip, { day: newDay, skipped: false }];
    }
    return [ ...daysWithSkip, { day: newDay, skipped: true }];
  }, []);

  $: isCollapsed = $form === formEnum.JOINING || $form === formEnum.EDITING;
</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:isSelecting={$isSelecting}
  daysToShow={daysToShowWithSkip.map((dws) => dws.day)}
  selectionLimits={eventIntervals}
  selectionEnabled={$form === formEnum.JOINING || $form === formEnum.EDITING}
  let:newSelections
>
  <!-- COLUMNS -->
  {#each daysToShowWithSkip as { day, skipped }}
    <CalendarDayColumn {day} {skipped} >
      <!-- DISABLED INTERVALS -->
      <UnavailableColumnOverlay
        eventIntervals={eventIntervalsSplitOnMidnight.filter((interval) =>
            interval.start.isSame(day, 'day')
        )}
      />
      <!-- OTHER USER SELECTIONS -->
      {#each userIntervalsByTime.filter((interval) => interval.start.isSame(day, 'date'))
          as interval (`${+interval.start}-${+interval.end}`)}
        <OtherUsersSelection {...interval} {maxUsernameCount} {isCollapsed} />
      {/each}
      <!-- DEFINED SELECTIONS -->
      {#each selections.filter((selection) => selection.start.isSame(day, 'date'))
          as selection (`${+selection.start}-${+selection.end}`)}
        <DefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections.filter((selection) => selection.start.isSame(day, 'date'))
          as selection}
        <NewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>