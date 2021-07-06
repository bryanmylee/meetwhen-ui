<script lang="ts">
  import type { LocalTimeInterval } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';
  import AvailableCells from './AvailableCells.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import Interval from './Interval.svelte';
  import { classes } from '$lib/utils/classes';
  import type { CalendarState } from './state/core';

  const disabled = getContext<Writable<boolean>>('disabled');
  const state = getContext<CalendarState>('state');
  const { getIntervalsInAvailableByDay } = state;

  export let day: Dayjs;
  export let available: LocalTimeInterval;
  $: intervals = $getIntervalsInAvailableByDay(available, day);

  $: intervalClass = classes([
    'pointer-events-none rounded-xl border-3 border-primary-lighter dark:shadow-md-primary transition-all',
    $disabled ? 'ml-0 opacity-0' : 'ml-4',
  ]);
</script>

{#each intervals as interval}
  <AvailableCells {day} {interval} />
  <!-- For indicating enabled/disabled status -->
  <Interval {interval} class={intervalClass} />
{/each}
