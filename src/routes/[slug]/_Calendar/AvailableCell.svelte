<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import type { LocalTimeInterval } from '$lib/gql/types';
  import { cx } from '$lib/utils/cx';
  import { zip } from '$lib/utils/zip';
  import { getCellPropsByTime } from './state';
  import { getHoursInTimeInterval } from './utils';

  export let x: number;
  export let available: LocalTimeInterval;
  $: hours = getHoursInTimeInterval(available, 0.5);
  $: props = hours.map($getCellPropsByTime);

  const getClass = (endOfAvailable: boolean) => {
    // prettier-ignore
    return cx(
      'shade min-w-32 min-h-10',
      [endOfAvailable, 'mb-2', 'border-gray-200 dark:border-gray-600 border-b-2']
    );
  };
</script>

{#each zip(hours, props) as [hour, { rowIndex, endOfAvailable }]}
  <GridItem {x} y={rowIndex} class={getClass(endOfAvailable)}>
    {hour.hour}-{hour.minute}
  </GridItem>
{/each}
