<script lang="ts">
  import { selectedIds, getLocalIntervalsFromIds } from './state';
  import Interval from './Interval.svelte';
</script>

{#each $getLocalIntervalsFromIds($selectedIds) as selectedInterval}
  <Interval {selectedInterval} class="pointer-events-none bg-primary rounded-xl" />
{/each}
