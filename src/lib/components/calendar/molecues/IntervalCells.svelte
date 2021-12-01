<script lang="ts">
	import GridItem from '$lib/components/utils/grid/GridItem.svelte';
	import type { CalendarState } from '../state/core';
	import type { Dayjs } from 'dayjs';
	import type { Interval } from '$lib/gql/types';
	import type { Writable } from 'svelte/store';
	import { classes } from '$lib/utils/classes';
	import { getContext } from 'svelte';
	import { getHoursInInterval, toId } from '$lib/utils/intervals';
	import { zip } from '$lib/utils/zip';

	const state = getContext<CalendarState>('state');
	const { getColIndexByDay, hourStepSize, getRowIndexByTime, numRows } = state;

	export let day: Dayjs;
	$: x = $getColIndexByDay(day);

	export let interval: Interval;
	$: hours = getHoursInInterval(interval, $hourStepSize);
	$: rowIndices = hours.map($getRowIndexByTime);
	$: separatorIndex = rowIndices[rowIndices.length - 1] + 1;
	$: isLastInCol = separatorIndex === $numRows;

	const disabled = getContext<Writable<boolean>>('disabled');

	const getCellClass = (index: number, isDisabled: boolean) => {
		const firstClass = classes([index === 0 && 'rounded-t-xl']);
		const midClass = classes([
			index % 2 === 1 && 'border-gray-200 dark:border-gray-600 border-b-2',
		]);
		const lastClass = classes([index === hours.length - 1 ? 'rounded-b-xl' : midClass]);
		return classes([
			'cell shade min-h-8 select-none',
			firstClass,
			lastClass,
			isDisabled ? 'min-w-20 cursor-default' : 'min-w-16 ml-4 cursor-pointer hover:shade-2',
		]);
	};
</script>

{#each zip(hours, rowIndices) as [hour, rowIndex], index}
	<GridItem
		dataId={toId(hour.onDayjs(day))}
		{x}
		y={rowIndex}
		class={getCellClass(index, $disabled)}
	/>
{/each}

<!-- represents the vertical gap between availabilities -->
{#if !isLastInCol}
	<GridItem {x} y={separatorIndex} class="min-h-4" />
{/if}

<style lang="postcss">
	:global(.cell) {
		transition: min-width 150ms ease-out, margin-left 150ms ease-out;
	}
</style>
