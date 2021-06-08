<script lang="ts">
  import ScheduleInterval from './ScheduleInterval.svelte';
  import { intervalsWithUsers } from './state/schedules';
</script>

{#each $intervalsWithUsers as { users, ...interval }, index}
  <ScheduleInterval id={index} {interval} {users} />
{/each}
