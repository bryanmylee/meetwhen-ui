<script lang="ts">
  import GridItem from '$lib/components/Grid/GridItem.svelte';
  import { Time } from '$lib/utils/time';
  import type { Interval } from '$lib/gql/types';
  import { getContext } from 'svelte';
  import type { CalendarState } from './state/core';

  const state = getContext<CalendarState>('state');
  const { hourStepSize, getColIndexByDay, getRowIndexByTime } = state;

  export let interval: Interval;
  $: ({ beg, end } = interval);
  $: x = $getColIndexByDay(beg);
  $: y = $getRowIndexByTime(Time.dayjs(beg));
  $: height = end.diff(beg, 'minute') / (60 * $hourStepSize);

  let className = '';
  export { className as class };
</script>

<GridItem let:element {x} {y} {height} class={className}>
  <slot {element} />
</GridItem>
