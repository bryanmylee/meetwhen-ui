<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import { getColIndexByDay, getRowIndexByTime, hourStepSize } from './state';
  import { Time } from '$lib/utils/time';
  import type { Interval } from '$lib/gql/types';

  export let selectedInterval: Interval;
  $: ({ beg, end } = selectedInterval);
  $: x = $getColIndexByDay(beg);
  $: y = $getRowIndexByTime(Time.dayjs(beg));
  $: height = end.diff(beg, 'minute') / (60 * $hourStepSize);
</script>

<GridItem {x} {y} {height} class="pointer-events-none bg-primary rounded-xl" />
