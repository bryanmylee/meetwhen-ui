<script lang="ts">
  import Interval from './Interval.svelte';
  import { cx } from '$lib/utils/cx';
  import { getContext } from 'svelte';
  import type { CalendarState } from './state/core';

  const state = getContext<CalendarState>('state');
  const { getLocalIntervalsFromIds, selectedIds, schedules } = state;

  $: className = cx('pointer-events-none bg-primary-fifty rounded-xl', [
    $schedules.length > 0,
    'ml-8',
  ]);
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as interval}
  <Interval {interval} class={className} />
{/each}
