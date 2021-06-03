<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import { getColIndexByDay, getRowIndexByTime, hourStepSize } from './state';
  import { Time } from '$lib/utils/time';
  import type { Interval } from '$lib/gql/types';

  export let interval: Interval;
  $: ({ beg, end } = interval);
  $: x = $getColIndexByDay(beg);
  $: y = $getRowIndexByTime(Time.dayjs(beg));
  $: height = end.diff(beg, 'minute') / (60 * $hourStepSize);

  let className = '';
  export { className as class };
</script>

<GridItem {x} {y} {height} class={className} />
