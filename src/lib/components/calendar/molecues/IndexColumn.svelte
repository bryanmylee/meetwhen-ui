<script lang="ts">
	import { Grid } from '$lib/components/utils/grid';
	import IndexColumnAvailable from './IndexColumnAvailable.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import { getContext } from 'svelte';

	const state = getContext<CalendarState>('state');
	const { numRows, availables } = state;
</script>

<Grid rows={$numRows} class="w-full h-full">
	{#each $availables as available}
		<IndexColumnAvailable {available} />
	{/each}
</Grid>
