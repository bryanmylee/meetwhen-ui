<script lang="ts">
  import { getLocalIntervalsFromIds } from './state/core';
  import { selectedIds } from './state/selections';
  import Interval from './Interval.svelte';
  import { cx } from '$lib/utils/cx';
  import { schedules } from './state/schedules';

  $: className = cx('pointer-events-none bg-primary-fifty rounded-xl', [
    $schedules.length > 0,
    'ml-8',
  ]);
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as interval}
  <Interval {interval} class={className} />
{/each}
