<script lang="ts">
	import Grid from '$lib/components/Grid/Grid.svelte';
	import IndexColumnAvailable from './IndexColumnAvailable.svelte';
	import { getContext } from 'svelte';
	import type { CalendarState } from './state/core';

	const state = getContext<CalendarState>('state');
	const { numRows, availables } = state;
</script>

<Grid rows={$numRows} class="w-full h-full">
	{#each $availables as available}
		<IndexColumnAvailable {available} />
	{/each}
</Grid>
