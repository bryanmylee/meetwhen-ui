<script lang="ts">
  import { zip } from '$lib/utils/zip';
  import type { LocalTimeInterval } from '$lib/gql/types';
  import { getHoursInTimeInterval } from './utils';
  import { getRowIndexByTime, hourStepSize, totalHours } from './state';
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { Time } from '$lib/utils/time';
  import { cx } from '$lib/utils/cx';

  export let available: LocalTimeInterval;
  $: hours = getHoursInTimeInterval(available, $hourStepSize);
  $: rowIndices = hours.map($getRowIndexByTime);
  $: lastHour = hours[hours.length - 1]?.add($hourStepSize, 'hour');

  const getClass = (hour: Time, index: number) => {
    const isLastInColumn = $totalHours[$totalHours.length - 1].unix === hour.unix;
    const isLastInAvailable = index === hours.length - 1;
    const lastClass = cx([!isLastInColumn, 'mb-4']);
    // prettier-ignore
    return cx(
      'flex items-center justify-end flex-1 pr-4 transform -translate-y-1/2',
      [isLastInAvailable, lastClass]);
  };
</script>

{#each zip(hours, rowIndices) as [hour, rowIndex], index}
  <GridItem y={rowIndex} class={getClass(hour, index)}>
    {#if hour.minute === 0}
      <span class="text-xs text-gray-400">
        {hour.format('ha')}
      </span>
    {/if}
  </GridItem>
{/each}

<!--GridItem y={rowIndices[rowIndices.length - 1]} class="flex items-end justify-end flex-1 pr-4">
  {#if lastHour?.minute === 0}
    <span class="text-xs text-gray-400">
      {lastHour?.format('ha')}
    </span>
  {/if}
</GridItem-->
