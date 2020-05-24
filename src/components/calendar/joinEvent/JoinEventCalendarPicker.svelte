<script>
  import dayjs from 'dayjs';

  import { getMergedIntervals, splitIntervalsOnMidnight, } from '../../../utils/intervals.js';
  import { newSelectionDurationPerDayInMs } from '../../../stores.js';

  import CalendarPickerBase from '../CalendarPickerBase.svelte';
  import CalendarDayColumn from '../CalendarDayColumn.svelte';
  import JoinEventUnavailableColumnOverlay from './JoinEventUnavailableColumnOverlay.svelte';
  import JoinEventOtherUsersSelection from './JoinEventOtherUsersSelection.svelte';
  import JoinEventDefinedSelection from './JoinEventDefinedSelection.svelte';
  import JoinEventNewSelection from './JoinEventNewSelection.svelte';

  export let selections = [];
  export let eventIntervals = [];
  export let userIntervalsByUsername = {};

  // The current selection split into different days.
  let newSelections = [];
  const MS_PER_MINUTE = 60000;
  $: {
    if (newSelections.length !== 0) {
      $newSelectionDurationPerDayInMs
          = newSelections[0].end - newSelections[0].start;
    } else {
      $newSelectionDurationPerDayInMs = 15 * MS_PER_MINUTE;
    }
  }

  let eventIntervalsSplitOnMidnight = [];
  $: eventIntervalsSplitOnMidnight = splitIntervalsOnMidnight(eventIntervals);

  // Intervals with combined usernames.
  let mergedIntervals = [];
  $: mergedIntervals
      = splitIntervalsOnMidnight(getMergedIntervals(userIntervalsByUsername));

  // The maximum number of usernames in all intervals.
  let maxUsernames = 0;
  $: maxUsernames = mergedIntervals.reduce((max, interval) => {
    const { length } = interval.usernames;
    return max >= length ? max : length;
  }, 0);

  // The days containing all event intervals.
  let daysToShow = [];
  $: daysToShow = eventIntervalsSplitOnMidnight.reduce((days, interval) => {
    const { length } = days;
    if (length === 0) return [ interval.start.startOf('day') ];
    if (days[length - 1].isSame(interval.start, 'day')) return days;
    return [ ...days, interval.start.startOf('day') ];
  }, []);

  const hours = Array.from(Array(24).keys())
      .map((inc) => dayjs().startOf('day').add(inc, 'hour'));

</script>

<CalendarPickerBase
  bind:selections={selections}
  bind:newSelections={newSelections}
>
  {#each daysToShow as day}
    <CalendarDayColumn {day} {hours} >
      <!-- Render unavailable intervals -->
      <JoinEventUnavailableColumnOverlay
        eventIntervals={eventIntervalsSplitOnMidnight.filter((interval) =>
            interval.start.isSame(day, 'day')
        )}
      />
      <!-- Render other user selections -->
      {#each mergedIntervals.filter((interval) =>
          interval.start.isSame(day, 'date')) as interval}
        <JoinEventOtherUsersSelection {interval} {maxUsernames} />
      {/each}
      <!-- Render current user selections -->
      {#each selections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <JoinEventDefinedSelection {...selection} />
      {/each}
      <!-- Render current user new selections -->
      {#each newSelections.filter((selection) =>
          selection.start.isSame(day, 'date')) as selection}
        <JoinEventNewSelection start={selection.start} />
      {/each}
    </CalendarDayColumn>
  {/each}
</CalendarPickerBase>