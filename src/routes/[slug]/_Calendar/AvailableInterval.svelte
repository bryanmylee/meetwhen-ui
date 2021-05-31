<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { Interval } from '$lib/gql/types';
  import { cx } from '$lib/utils/cx';
  import { zip } from '$lib/utils/zip';
  import type { Dayjs } from 'dayjs';
  import { getItemPropsByTime, hourStepSize } from './state';
  import { getHoursInInterval } from './utils';

  export let x: number;
  export let day: Dayjs;
  export let interval: Interval;
  $: hours = getHoursInInterval(interval, $hourStepSize);
  $: props = hours.map($getItemPropsByTime);

  const getClass = (endOfAvailable: boolean) => {
    // prettier-ignore
    return cx(
      'shade min-w-32 min-h-10',
      [endOfAvailable, 'mb-2', 'border-gray-200 dark:border-gray-600 border-b-2']
    );
  };
</script>

{#each zip(hours, props) as [hour, prop]}
  <GridItem {x} y={prop.rowIndex} class={getClass(prop.endOfAvailable)}>
    {hour.hour}-{hour.minute}
  </GridItem>
{/each}
