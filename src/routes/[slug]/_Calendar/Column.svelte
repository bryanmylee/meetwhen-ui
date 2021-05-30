<script lang="ts">
  import ColumnHeader from './ColumnHeader.svelte';
  import { getIntervalsInDay } from './state';
  import type { Dayjs } from 'dayjs';
  import { getHoursInInterval } from './utils';

  export let day: Dayjs;
  $: console.log($getIntervalsInDay(day));
</script>

<div class="flex flex-col w-full min-w-24">
  <ColumnHeader {day} />

  <div class="relative flex-1 w-full shade">
    <div class="flex flex-col h-full">
      {#each $getIntervalsInDay(day) as interval}
        {#each getHoursInInterval(interval) as _}
          <div
            class="flex flex-col w-full h-full border-b-2 border-gray-200 dark:border-gray-600 last:border-0 min-h-10"
          />
        {/each}
      {/each}
    </div>
  </div>
</div>
