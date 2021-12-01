<script lang="ts">
	import ScheduleInterval from './ScheduleInterval.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import { getContext } from 'svelte';

	const state = getContext<CalendarState>('state');
	const { intervalsWithUsers } = state;
</script>

{#each $intervalsWithUsers as { users, ...interval }, index}
	<ScheduleInterval id={index} {interval} {users} />
{/each}
