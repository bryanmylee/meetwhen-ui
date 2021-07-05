<script lang="ts">
  import Interval from './Interval.svelte';
  import { Selecting } from '$lib/components/SelectableProvider/selecting';
  import { classes } from '$lib/utils/classes';
  import { getContext } from 'svelte';
  import type { CalendarState } from './state/core';
  import type { Writable } from 'svelte/store';

  const disabled = getContext<Writable<boolean>>('disabled');
  const state = getContext<CalendarState>('state');
  const { getLocalIntervalsFromIds } = state;

  export let selectingIds: string[];

  export let selecting: Selecting;
  $: className = classes([
    'pointer-events-none rounded-xl transition-all',
    selecting === Selecting.CREATE &&
      'bg-primary-fifty shadow-xl-primary border-3 border-primary-darker dark:border-white',
    selecting === Selecting.DELETE && 'border-3 border-red-400',
    $disabled ? 'ml-0' : 'ml-4',
  ]);
</script>

{#each $getLocalIntervalsFromIds(selectingIds) as interval}
  <Interval {interval} class={className} />
{/each}
