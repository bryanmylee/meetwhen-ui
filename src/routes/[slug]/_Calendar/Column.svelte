<script lang="ts">
  import ColumnHeader from './ColumnHeader.svelte';
  import { getIntervalsInDay, localTimeIntervalsPerDay } from './state';
  import { getHoursInTimeInterval, isIn, setTimeOfDay } from './utils';
  import type { Dayjs } from 'dayjs';

  export let day: Dayjs;
  $: $getIntervalsInDay(day);
</script>

<div class="flex flex-col w-full min-w-24">
  <ColumnHeader {day} />

  <div class="relative flex-1 w-full shade">
    <div class="flex flex-col h-full space-y-4">
      {#each $localTimeIntervalsPerDay as localTimeInterval}
        {#each getHoursInTimeInterval(localTimeInterval) as hour}
          <div
            class="flex flex-col w-full h-full border-b-2 border-gray-200 dark:border-gray-600 last:border-0 min-h-10"
          />
        {/each}
      {/each}
    </div>
  </div>
</div>
