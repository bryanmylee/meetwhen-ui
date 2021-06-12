<script lang="ts">
  import type { LocalTimeInterval } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';
  import { getIntervalsInAvailableByDay } from './state/intervals';
  import AvailableCells from './AvailableCells.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import Interval from './Interval.svelte';
  import { cx } from '$lib/utils/cx';

  export let day: Dayjs;
  export let available: LocalTimeInterval;
  $: intervals = $getIntervalsInAvailableByDay(available, day);

  const disabled = getContext<Writable<boolean>>('disabled');

  // prettier-ignore
  $: intervalClass = cx(
    'shadow-lg pointer-events-none rounded-xl border-3 border-primary-lighter dark:shadow-md-primary transition-all',
    [$disabled, 'opacity-0'],
  );
</script>

{#each intervals as interval}
  <AvailableCells {day} {interval} />
  <!-- For indicating enabled/disabled status -->
  <Interval {interval} class={intervalClass} />
{/each}
