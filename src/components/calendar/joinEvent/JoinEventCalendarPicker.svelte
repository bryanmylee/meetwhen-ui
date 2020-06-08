<svelte:options immutable={true}/>
<script>
  import dayjs from 'dayjs';

  import { getMergedIntervals, splitIntervalsOnMidnight, } from '../../../utils/interval.js';

  import CalendarPickerBase from '../CalendarPickerBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import JoinEventUnavailableColumnOverlay from './JoinEventUnavailableColumnOverlay.svelte';
  import JoinEventOtherUsersSelection from './JoinEventOtherUsersSelection.svelte';
  import JoinEventDefinedSelection from './JoinEventDefinedSelection.svelte';
  import JoinEventNewSelection from './JoinEventNewSelection.svelte';

  // COMPONENT BINDINGS
  // ==================
  export let selections = [];

  // PROPS
  // =====
  export let eventIntervals = [];
  export let userIntervalsByUsername = {};
  export let isCollapsed = false;

  // REACTIVE ATTRIBUTES
  // ===================
  $: eventIntervalsSplitOnMidnight = splitIntervalsOnMidnight(eventIntervals);

  // User intervals with grouped usernames.
  $: userIntervalsByTime
      = splitIntervalsOnMidnight(getMergedIntervals(userIntervalsByUsername));

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
  {daysToShow}
  selectionLimits={eventIntervals}
  let:newSelections={newSelections}
>
  <!-- COLUMNS -->
  {#each daysToShow as day}
    <CalendarDayColumn {day} >
      <!-- DISABLED INTERVALS -->
      <JoinEventUnavailableColumnOverlay
        eventIntervals={eventIntervalsSplitOnMidnight.filter((interval) =>
            interval.start.isSame(day, 'day')
        )}
      />
      <!-- OTHER USER SELECTIONS -->
      {#each userIntervalsByTime.filter((interval) =>
          interval.start.isSame(day, 'date')) as interval}
        <JoinEventOtherUsersSelection {...interval} {maxUsernameCount} {isCollapsed} />
      {/each}
      <!-- DEFINED SELECTIONS -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <JoinEventDefinedSelection {...selection} />
      {/each}
      <!-- NEW SELECTIONS -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <JoinEventNewSelection {...selection} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>