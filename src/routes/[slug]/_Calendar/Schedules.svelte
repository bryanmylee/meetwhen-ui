<script lang="ts">
  import { intervalsWithUsers } from './state/schedules';
  import Interval from './Interval.svelte';
</script>

{#each $intervalsWithUsers as intervalWithUser}
  <Interval interval={intervalWithUser} class="rounded-xl bg-red-300" />
{/each}
