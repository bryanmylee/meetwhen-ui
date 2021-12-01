<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Interval, Schedule } from '$lib/gql/types';
	import { getCoreState } from './state/core';
	import Column from './Column.svelte';
	import Grid from '$lib/components/utils/grid/Grid.svelte';
	import IndexHeader from './IndexHeader.svelte';
	import SelectableProvider from '$lib/components/SelectableProvider/SelectableProvider.svelte';
	import GridItem from '$lib/components/utils/grid/GridItem.svelte';
	import IndexColumn from './IndexColumn.svelte';
	import Selected from './Selected.svelte';
	import Highlight from './Highlight.svelte';
	import Schedules from './Schedules.svelte';
	import FullscreenButton from './FullscreenButton.svelte';
	import { classes } from '$lib/utils/classes';
	import CalendarHint from './CalendarHint.svelte';

	const state = getCoreState();
	const {
		selectedIds,
		intervals: intervalsInput,
		schedules: schedulesInput,
		selecting,
		isFullscreen,
		selectedIntervals: selectedIntervalsDep,
		getIdsFromIntervals,
		getDayHourIdsBetween,
		numRows,
		days,
	} = state;
	setContext('state', state);

	export const reset: () => void = () => {
		$selectedIds = [];
	};

	export let intervals: Interval[] = [];
	$: $intervalsInput = intervals;

	export let selectedIntervals: Interval[] = [];
	$: selectedIntervals = $selectedIntervalsDep;

	export const initializeWithSelected: (initial: Interval[]) => void = (initial) => {
		$selectedIds = $getIdsFromIntervals(initial);
	};

	export let schedules: Schedule[] = [];
	$: $schedulesInput = schedules;

	export let disabled = false;
	const _disabled = writable(disabled);
	$: $_disabled = disabled;
	setContext('disabled', _disabled);

	let hasTouched = false;
	$: if (!$_disabled) {
		hasTouched = false;
	}

	export let error = '';

	let selector: SelectableProvider | undefined;

	$: calendarClass = classes([
		'flex flex-col flex-1 overflow-hidden card',
		$isFullscreen ? 'fixed inset-4 z-50' : 'relative z-0',
	]);
</script>

<div class={calendarClass} class:error={error !== ''}>
	<SelectableProvider
		bind:this={selector}
		bind:selectedIds={$selectedIds}
		bind:selecting={$selecting}
		interpolateBetween={$getDayHourIdsBetween}
		{disabled}
		let:selectingIds
		on:toggle={() => (hasTouched = true)}
	>
		<div class="relative h-full min-h-0 p-4 pt-1 overflow-hidden focus:outline-none">
			<div class="absolute top-0 left-0 z-30 bg-default corner" />
			<div class="layout-grid">
				<GridItem x={1} y={0} class="sticky top-0 z-20 flex space-x-4 bg-default">
					<IndexHeader />
				</GridItem>
				<GridItem x={0} y={1} class="sticky left-0 z-20 flex flex-col bg-default">
					<IndexColumn />
				</GridItem>
				<GridItem x={1} y={1}>
					<Grid
						rows={$numRows}
						cols={$days.length}
						class="relative z-0 min-w-full min-h-full gap-x-4"
					>
						{#each $days as day}
							<Column {day} />
						{/each}
						<Selected />
						<Highlight {selectingIds} />
						<Schedules />
						<CalendarHint {hasTouched} />
					</Grid>
				</GridItem>
			</div>
		</div>
	</SelectableProvider>
	<FullscreenButton bind:isFullscreen={$isFullscreen} />
	{#if error !== ''}
		<span
			class="absolute p-2 text-xs italic text-red-400 transform -translate-x-1/2 rounded pointer-events-none dark:text-red-400 ring ring-red-400 bottom-4 left-1/2 bg-default"
		>
			{error}
		</span>
	{/if}
</div>

<style lang="postcss">
	* {
		--header-row-height: 3.5rem;
		--index-col-width: 3rem;
	}

	.layout-grid {
		grid-template: var(--header-row-height) auto / var(--index-col-width) auto;
		@apply grid h-full overflow-auto;
	}

	.corner {
		width: calc(var(--index-col-width) + 1rem);
		height: var(--header-row-height);
	}
</style>
