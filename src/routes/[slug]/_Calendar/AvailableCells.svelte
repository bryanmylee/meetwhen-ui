<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { Interval } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { cx } from '$lib/utils/cx';
  import { zip } from '$lib/utils/zip';
  import type { Dayjs } from 'dayjs';
  import { getContext } from 'svelte';
  import { getHoursInInterval, toId } from './utils/intervals';
  import type { CalendarState } from './state/core';

  const state = getContext<CalendarState>('state');
  const { getColIndexByDay, hourStepSize, getRowIndexByTime, numRows } = state;

  export let day: Dayjs;
  $: x = $getColIndexByDay(day);

  export let interval: Interval;
  $: hours = getHoursInInterval(interval, $hourStepSize);
  $: rowIndices = hours.map($getRowIndexByTime);
  $: separatorIndex = rowIndices[rowIndices.length - 1] + 1;
  $: isLastInCol = separatorIndex === $numRows;

  const disabled = getContext<Writable<boolean>>('disabled');

  const getCellClass = (index: number, isDisabled: boolean) => {
    const firstClass = cx([index === 0, 'rounded-t-xl']);
    const midClass = cx([index % 2 === 1, 'border-gray-200 dark:border-gray-600 border-b-2']);
    const lastClass = cx([index === hours.length - 1, 'rounded-b-xl', midClass]);
    // prettier-ignore
    return cx(
      'shade min-w-32 min-h-5 select-none',
      firstClass,
      lastClass,
      [isDisabled, 'cursor-default', 'cursor-pointer hover:shade-2']
    );
  };
</script>

{#each zip(hours, rowIndices) as [hour, rowIndex], index}
  <GridItem
    dataId={toId(hour.onDayjs(day))}
    {x}
    y={rowIndex}
    class={getCellClass(index, $disabled)}
  />
{/each}

{#if !isLastInCol}
  <GridItem {x} y={separatorIndex} class="min-h-4" />
{/if}
