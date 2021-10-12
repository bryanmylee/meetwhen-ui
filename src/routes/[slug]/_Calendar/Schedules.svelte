<script lang="ts">
	import ScheduleInterval from './ScheduleInterval.svelte';
	import { getContext } from 'svelte';
	import type { CalendarState } from './state/core';

	const state = getContext<CalendarState>('state');
	const { intervalsWithUsers } = state;
</script>

{#each $intervalsWithUsers as { users, ...interval }, index}
	<ScheduleInterval id={index} {interval} {users} />
{/each}
