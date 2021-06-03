<script lang="ts">
  import { zip } from '$lib/utils/zip';
  import type { LocalTimeInterval } from '$lib/gql/types';
  import { getHoursInTimeInterval } from './utils/intervals';
  import { hourStepSize } from './state/core';
  import { getRowIndexByTime } from './state/ui';
  import { hoursInDay } from './state/intervals';
  import GridItem from '$lib/components/Grid/GridItem.svelte';

  export let available: LocalTimeInterval;
  $: hours = getHoursInTimeInterval(available, $hourStepSize);
  $: rowIndices = hours.map($getRowIndexByTime);

  $: endHour = hours[hours.length - 1].add($hourStepSize, 'hour');
  $: endHourIndex = rowIndices[rowIndices.length - 1];
  $: isEndHourLastInColumn =
    $hoursInDay[$hoursInDay.length - 1].unix === hours[hours.length - 1].unix;
</script>

{#each zip(hours, rowIndices) as [hour, rowIndex]}
  <GridItem
    y={rowIndex}
    class="flex items-center justify-end flex-1 pr-4 transform -translate-y-1/2 min-h-5"
  >
    {#if hour.minute === 0}
      <span class="text-xs text-gray-400">
        {hour.format('ha')}
      </span>
    {/if}
  </GridItem>
{/each}

{#if !isEndHourLastInColumn}
  <GridItem y={endHourIndex} class="flex items-end justify-end flex-1 pr-4 min-h-5">
    {#if endHour.minute === 0}
      <span class="text-xs text-gray-400">
        {endHour.format('ha')}
      </span>
    {/if}
  </GridItem>
  <GridItem y={endHourIndex + 1} class="flex items-center justify-end flex-1 pr-4 min-h-2">
    <span class="text-xs text-gray-400 transform -translate-y-1/3"> ... </span>
  </GridItem>
{:else}
  <div class="absolute bottom-0 right-0 flex items-end justify-end pr-4">
    {#if endHour.minute === 0}
      <span class="text-xs text-gray-400">
        {endHour.format('ha')}
      </span>
    {/if}
  </div>
{/if}
