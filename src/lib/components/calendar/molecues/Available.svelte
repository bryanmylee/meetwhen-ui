<script lang="ts">
	import GridInterval from '../atoms/GridInterval.svelte';
	import IntervalCells from './IntervalCells.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import type { Dayjs } from 'dayjs';
	import type { LocalTimeInterval } from '$lib/gql/types';
	import type { Writable } from 'svelte/store';
	import { classes } from '$lib/utils/classes';
	import { getContext } from 'svelte';

	const disabled = getContext<Writable<boolean>>('disabled');
	const state = getContext<CalendarState>('state');
	const { getIntervalsInAvailableByDay, intervalHasLeftCorners } = state;

	export let day: Dayjs;
	export let available: LocalTimeInterval;
	$: intervals = $getIntervalsInAvailableByDay(available, day);

	$: getIntervalClass = ({ top, bottom }: { top: boolean; bottom: boolean }) =>
		classes(
			'pointer-events-none rounded-xl border-3 border-primary-lighter dark:shadow-md-primary transition-all',
			$disabled ? 'ml-0 opacity-0' : 'ml-4',
			top && 'rounded-tl-none',
			bottom && 'rounded-bl-none'
		);
</script>

{#each intervals as interval}
	<IntervalCells {day} {interval} />
	<!-- For indicating enabled/disabled status -->
	<GridInterval {interval} class={getIntervalClass($intervalHasLeftCorners(interval))} />
{/each}
