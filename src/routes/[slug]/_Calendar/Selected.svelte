<script lang="ts">
  import Interval from './Interval.svelte';
  import { classes } from '$lib/utils/classes';
  import { getContext } from 'svelte';
  import type { CalendarState } from './state/core';

  const state = getContext<CalendarState>('state');
  const { getLocalIntervalsFromIds, selectedIds, schedules } = state;

  $: className = classes([
    'pointer-events-none bg-primary-fifty rounded-xl',
    $schedules.length > 0 && 'ml-8',
  ]);
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as interval}
  <Interval {interval} class={className} />
{/each}
