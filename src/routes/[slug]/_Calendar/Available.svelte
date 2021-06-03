<script lang="ts">
  import type { LocalTimeInterval } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';
  import { getIntervalsInAvailableByDay } from './state';
  import AvailableInterval from './AvailableInterval.svelte';

  export let day: Dayjs;
  export let available: LocalTimeInterval;
  $: intervals = $getIntervalsInAvailableByDay(available, day);
</script>

{#each intervals as interval}
  <AvailableInterval {day} {interval} />
{/each}
