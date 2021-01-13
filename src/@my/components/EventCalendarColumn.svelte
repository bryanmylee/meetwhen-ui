<script lang="ts">
  import {
    getUserTaggedIntervals,
    hasTopInterval,
    hasBottomInterval,
    hasTopHalfHour,
    hasBottomHalfHour
  } from '@my/utils/eventCalendar';
  import { getKey } from '@my/models/Interval';
  import EventCalendarHalfHour from './EventCalendarHalfHour.svelte';
  import EventCalendarUserInterval from './EventCalendarUserInterval.svelte';
  import type { Dayjs } from 'dayjs';
  import type Interval from '@my/models/Interval';
  import type SelectState from '@my/models/SelectState';

  export let day: Dayjs;
  export let hours: Dayjs[] = [];
  const getDayDiff = (d: Dayjs, hs: Dayjs[]) => {
    if (hs.length === 0) return 0;
    return d.startOf('day').diff(hs[0].startOf('day'), 'day');
  };
  $: dayDiff = getDayDiff(day, hours);
  $: todayHours = hours.map(h => h.add(dayDiff, 'day'));

  export let users: Record<string, Interval[]> = {};
  $: userTaggedIntervals = getUserTaggedIntervals(users);

  export let maxPerInterval = 0;

  export let selectedHours: Dayjs[] = [];
  export let selecting: SelectState;

  export let selectFocused = false;
  export let selectFocusY = 0;
  export let editable = false;

  export let userIntervalFocused = false;
</script>

<div class="flex flex-col w-full transform min-w-24">

  <div class="sticky top-0 z-20 flex flex-col items-center justify-center h-16 bg-white">
    <p class="font-bold">{day.format('ddd')}</p>
    <p class="text-sm">{day.format('DD MMM')}</p>
  </div>

  <div class="relative flex-1 w-full overflow-hidden shade">
    <div class="flex flex-col h-full">
      {#each todayHours as _}
        <div class="flex flex-col w-full h-full border-b-2 last:border-0 min-h-16"/>
      {/each}
    </div>

    <div class="absolute inset-0 flex flex-col">
      {#each todayHours as hour, i}
        {#each [0, 30].map(m => hour.add(m, 'minute')) as halfHour, j}
          <EventCalendarHalfHour
            {day} {halfHour}
            selected={selectedHours.some(h => h.isSame(halfHour))}
            {selecting}
            hasTop={hasTopHalfHour(halfHour, selectedHours)}
            hasBottom={hasBottomHalfHour(halfHour, selectedHours)}
            disabled={!editable}
            focused={selectFocused && i * 2 + j === selectFocusY}
            class="flex-1 ml-8"
          />
        {/each}
      {/each}
    </div>

    {#each userTaggedIntervals as interval (getKey(interval))}
      <EventCalendarUserInterval
        {editable}
        {...interval}
        {hours}
        {maxPerInterval}
        hasTop={hasTopInterval(interval, userTaggedIntervals)}
        hasBottom={hasBottomInterval(interval, userTaggedIntervals)}
        focused={userIntervalFocused}
      />
    {/each}
  </div>

</div>

