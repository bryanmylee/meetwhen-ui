<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { Interval } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { cx } from '$lib/utils/cx';
  import { zip } from '$lib/utils/zip';
  import type { Dayjs } from 'dayjs';
  import { getContext } from 'svelte';
  import { hourStepSize } from './state/core';
  import { numRows, getColIndexByDay, getRowIndexByTime } from './state/ui';
  import { getHoursInInterval, toId } from './utils/intervals';

  export let day: Dayjs;
  $: x = $getColIndexByDay(day);

  export let interval: Interval;
  $: hours = getHoursInInterval(interval, $hourStepSize);
  $: rowIndices = hours.map($getRowIndexByTime);
  $: separatorIndex = rowIndices[rowIndices.length - 1] + 1;
  $: isLastInCol = separatorIndex === $numRows;

  const disabled = getContext<Writable<boolean>>('disabled');

  const getClass = (index: number, isDisabled: boolean) => {
    const firstClass = cx([index === 0, 'rounded-t-xl']);
    const midClass = cx([index % 2 === 1, 'border-gray-200 dark:border-gray-600 border-b-2']);
    const lastClass = cx([index === hours.length - 1, 'rounded-b-xl', midClass]);
    // prettier-ignore
    return cx(
      'shade min-w-32 min-h-5 select-none',
      firstClass,
      lastClass,
      [isDisabled, 'cursor-default', 'cursor-pointer']
    );
  };
</script>

{#each zip(hours, rowIndices) as [hour, rowIndex], index}
  <GridItem dataId={toId(hour.onDayjs(day))} {x} y={rowIndex} class={getClass(index, $disabled)} />
{/each}

{#if !isLastInCol}
  <GridItem {x} y={separatorIndex} class="min-h-4" />
{/if}
