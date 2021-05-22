<script lang="ts">
  import dayjs from 'dayjs';
  import { EARLIEST_OFFSET, HOURS, toDisplay, toId, UTCToDisplay, UTC_OFFSETS } from './utils';
  import type { Dayjs } from 'dayjs';
  import Select from '$lib/components/Select/Select.svelte';

  let fromIndex = 9;
  let toIndex = 7;

  export let fromHour: Dayjs;
  export let toHour: Dayjs;

  $: fromHour = HOURS[fromIndex].add(UTCOffset, 'hour');
  $: toHours = HOURS.map((hour) => hour.add(fromHour.hour() + 1, 'hour'));
  $: toHour = toHours[toIndex].add(UTCOffset, 'hour');

  const currentUTC = Math.floor(dayjs().utcOffset() / 60);

  let selectedUTCIndex = currentUTC - EARLIEST_OFFSET;
  $: selectedUTC = UTC_OFFSETS[selectedUTCIndex];
  $: UTCOffset = selectedUTC - currentUTC;
  $: console.log({ fromHour, toHour });
</script>

<div class="flex items-center space-x-4">
  <span>From</span>
  <Select
    bind:index={fromIndex}
    items={HOURS.slice(0, 24)}
    getDisplay={toDisplay}
    getId={toId}
    class="flex-1 shade rounded-xl"
  />
  <span>To</span>
  <Select
    bind:index={toIndex}
    items={toHours.slice(1)}
    getDisplay={toDisplay}
    getId={toId}
    class="flex-1 shade rounded-xl"
  />
  <Select
    bind:index={selectedUTCIndex}
    items={UTC_OFFSETS}
    getDisplay={UTCToDisplay}
    class="!ml-0 !-mr-2 text-xs font-bold rounded-xl"
  />
</div>
