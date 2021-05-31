<script lang="ts">
  import type { LocalTimeInterval } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';
  import AvailableInterval from './AvailableInterval.svelte';
  import { getIntervalsInAvailableByDay } from './state';

  export let x: number;
  export let day: Dayjs;
  export let available: LocalTimeInterval;
  $: intervals = $getIntervalsInAvailableByDay(available, day);
</script>

{#each intervals as interval}
  <AvailableInterval {x} {day} {interval} />
{/each}
