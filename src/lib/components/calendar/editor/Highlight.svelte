<script lang="ts">
	import GridInterval from '../atoms/GridInterval.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import type { Writable } from 'svelte/store';
	import { Selecting } from '$lib/components/utils/selectable/selecting';
	import { classes } from '$lib/utils/classes';
	import { getContext } from 'svelte';

	const disabled = getContext<Writable<boolean>>('disabled');
	const state = getContext<CalendarState>('state');
	const { getLocalIntervalsFromIds, selecting } = state;

	export let selectingIds: string[];
	$: className = classes([
		'pointer-events-none rounded-xl transition-all',
		$selecting === Selecting.CREATE &&
			'bg-primary-fifty shadow-xl-primary border-3 border-primary-darker dark:border-white',
		$selecting === Selecting.DELETE && 'border-3 border-red-400',
		$disabled ? 'ml-0' : 'ml-4',
	]);
</script>

{#each $getLocalIntervalsFromIds(selectingIds) as interval}
	<GridInterval {interval} class={className} />
{/each}
