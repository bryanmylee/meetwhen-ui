<script lang="ts">
	import { getContext } from 'svelte';
	import type { CalendarState } from './state/core';

	const state = getContext<CalendarState>('state');
	const { days } = state;
</script>

{#each $days as day}
	<div class="flex flex-col items-center justify-center w-full h-full">
		<p class="font-bold">{day.format('ddd')}</p>
		<p class="-mt-1 text-sm">{day.format('DD MMM')}</p>
	</div>
{/each}
