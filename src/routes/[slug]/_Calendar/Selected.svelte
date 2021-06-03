<script lang="ts">
  import { selectedIds, getLocalIntervalsFromIds } from './state';
  import Interval from './Interval.svelte';
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as interval}
  <Interval {interval} class="pointer-events-none bg-primary rounded-xl" />
{/each}
