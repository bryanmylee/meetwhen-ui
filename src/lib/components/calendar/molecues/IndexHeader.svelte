<script lang="ts">
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import { getContext } from 'svelte';

	const state = getContext<CalendarState>('state');
	const { days } = state;
</script>

{#each $days as day}
	<div class="flex flex-col items-center justify-center w-full h-full">
		<p class="font-bold">{day.format('ddd')}</p>
		<p class="-mt-1 text-sm">{day.format('DD MMM')}</p>
	</div>
{/each}
