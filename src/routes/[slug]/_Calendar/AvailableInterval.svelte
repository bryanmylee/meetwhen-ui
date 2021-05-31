<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { Interval } from '$lib/gql/types';
  import { cx } from '$lib/utils/cx';
  import type { Time } from '$lib/utils/time';
  import { zip } from '$lib/utils/zip';
  import type { Dayjs } from 'dayjs';
  import { getItemPropsByTime, hourStepSize } from './state';
  import { getHoursInInterval, toId } from './utils';

  export let x: number;
  export let day: Dayjs;
  export let interval: Interval;
  $: hours = getHoursInInterval(interval, $hourStepSize);
  $: props = hours.map($getItemPropsByTime);

  const getClass = (index: number) => {
    return cx(
      'shade min-w-32 min-h-5',
      [index === 0, 'rounded-t-xl'],
      [
        index === hours.length - 1,
        'rounded-b-xl mb-2',
        cx([index % 2 === 1, 'border-gray-200 dark:border-gray-600 border-b-2']),
      ]
    );
  };
</script>

{#each zip(hours, props) as [hour, prop], index}
  <GridItem dataId={toId(hour.onDayjs(day))} {x} y={prop.rowIndex} class={getClass(index)} />
{/each}
