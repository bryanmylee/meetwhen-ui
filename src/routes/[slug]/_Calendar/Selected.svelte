<script lang="ts">
  import { getLocalIntervalsFromIds } from './state/core';
  import { selectedIds } from './state/selections';
  import Interval from './Interval.svelte';
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as interval}
  <Interval {interval} class="pointer-events-none bg-primary-fifty rounded-xl" />
{/each}
