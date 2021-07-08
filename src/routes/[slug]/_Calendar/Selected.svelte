<script lang="ts">
  import GridInterval from './GridInterval.svelte';
  import { classes } from '$lib/utils/classes';
  import { getContext } from 'svelte';
  import type { CalendarState } from './state/core';
  import type { Writable } from 'svelte/store';

  const disabled = getContext<Writable<boolean>>('disabled');
  const state = getContext<CalendarState>('state');
  const { getLocalIntervalsFromIds, selectedIds } = state;

  $: className = classes([
    'pointer-events-none bg-primary-fifty rounded-xl transition-all',
    $disabled ? 'ml-0' : 'ml-4',
  ]);
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as interval}
  <GridInterval {interval} class={className} />
{/each}
