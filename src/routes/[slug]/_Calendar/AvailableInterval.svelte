<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { Interval } from '$lib/gql/types';
  import { cx } from '$lib/utils/cx';
  import type { Time } from '$lib/utils/time';
  import { zip } from '$lib/utils/zip';
  import type { Dayjs } from 'dayjs';
  import { getRowIndexByTime, hourStepSize, totalHours } from './state';
  import { getHoursInInterval, toId } from './utils';

  export let x: number;
  export let day: Dayjs;
  export let interval: Interval;
  $: hours = getHoursInInterval(interval, $hourStepSize);
  $: rowIndices = hours.map($getRowIndexByTime);

  const getClass = (hour: Time, index: number) => {
    const isLastInColumn = $totalHours[$totalHours.length - 1].unix === hour.unix;
    const isLastInInterval = index === hours.length - 1;
    const lastClass = cx('rounded-b-xl', [!isLastInColumn, 'mb-8']);
    const notLastClass = cx([index % 2 === 1, 'border-gray-200 dark:border-gray-600 border-b-2']);
    return cx(
      'shade min-w-32 min-h-5',
      [index === 0, 'rounded-t-xl'],
      [isLastInInterval, lastClass, notLastClass]
    );
  };
</script>

{#each zip(hours, rowIndices) as [hour, rowIndex], index}
  <GridItem dataId={toId(hour.onDayjs(day))} {x} y={rowIndex} class={getClass(hour, index)} />
{/each}
