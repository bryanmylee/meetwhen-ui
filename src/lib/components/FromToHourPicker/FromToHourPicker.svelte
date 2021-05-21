<script lang="ts">
  import dayjs from 'dayjs';
  import {
    EARLIEST_OFFSET,
    HOURS,
    toDisplay,
    toId,
    utcOffsetsToDisplay,
    UTC_OFFSETS,
  } from './utils';
  import type { Dayjs } from 'dayjs';
  import Select from '$lib/components/Select/Select.svelte';

  let fromIndex = 9;
  let toIndex = 7;

  export let fromHour: Dayjs;
  export let toHour: Dayjs;

  $: fromHour = HOURS[fromIndex];
  $: toHours = HOURS.map((hour) => hour.add(fromHour.hour(), 'hour'));
  $: toHour = toHours[toIndex];

  const currentUtcOffset = Math.floor(dayjs().utcOffset() / 60);
  let utcOffsetIndex = currentUtcOffset - EARLIEST_OFFSET;

  export let utcOffset: number;
  $: utcOffset = UTC_OFFSETS[utcOffsetIndex];
</script>

<div class="flex items-center space-x-4">
  <span>From</span>
  <Select
    bind:index={fromIndex}
    items={HOURS.slice(0, 24)}
    getDisplay={toDisplay}
    getId={toId}
    class="flex-1 bg-gray-100 rounded-xl"
  />
  <span>To</span>
  <Select
    bind:index={toIndex}
    items={toHours.slice(1)}
    getDisplay={toDisplay}
    getId={toId}
    class="flex-1 bg-gray-100 rounded-xl"
  />
  <Select
    bind:index={utcOffsetIndex}
    items={UTC_OFFSETS}
    getDisplay={utcOffsetsToDisplay}
    class="!ml-0 !-mr-2 text-xs font-bold rounded-xl"
  />
</div>
