<script lang="ts">
  import type { LocalTimeInterval } from '$lib/gql/types';
  import type { Dayjs } from 'dayjs';
  import { getIntervalsInAvailableByDay } from './state/intervals';
  import AvailableCells from './AvailableCells.svelte';

  export let day: Dayjs;
  export let available: LocalTimeInterval;
  $: intervals = $getIntervalsInAvailableByDay(available, day);
</script>

{#each intervals as interval}
  <AvailableCells {day} {interval} />
{/each}
