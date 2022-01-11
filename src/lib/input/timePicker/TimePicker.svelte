<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { Grid, GridItem } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import {
		dateTimeFromId,
		dateTimeToId,
		dateTimeComposeId,
	} from '$lib/core/utils/dayjs/dateTimeIds';
	import { bound } from '$lib/core/utils/bound';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { SelectionProvider } from '$lib/input';
	import { createTimePickerState } from './utils/createTimePickerState';
	import {
		setCurrentDateTimeElement,
		setTimePickerState,
	} from './utils/timePickerContext';
	import TimePickerGridItem from './atoms/TimePickerGridItem.svelte';

	export let validIntervals: Interval[] = [];
	const _validIntervals = writable(validIntervals);
	$: $_validIntervals = validIntervals;

	export let resolution = 30;
	const _resolution = writable(resolution);
	$: $_resolution = resolution;

	/**
	 * SelectionProvider selectedIds binding.
	 */
	let selectedIds: string[] = [];

	const state = createTimePickerState(_validIntervals, _resolution);
	const {
		localTimeCells,
		timeIdToRowNumber,
		dateIds,
		dateIdToColumnNumber,
		timeCellsByDate,
	} = state;
	setTimePickerState(state);

	export let initDateTime = dayjs();
	const currentDateTime = writable<Dayjs>(initDateTime);
	/**
	 * SelectionProvider currentId binding.
	 */
	const currentId = bound(currentDateTime, dateTimeToId, dateTimeFromId);

	const currentDateTimeElement = writable<Maybe<HTMLButtonElement>>();
	setCurrentDateTimeElement(currentDateTimeElement);

	const handleFocusUpdate = async () => {
		await tick();
		$currentDateTimeElement?.focus();
	};
</script>

<div tabindex={0} class="time-picker focus">
	<SelectionProvider
		bind:selectedIds
		bind:currentId={$currentId}
		on:focusupdate={handleFocusUpdate}
		let:isIdSelected
		let:isIdCurrent
		let:isIdDisabled
		let:selectMode
	>
		<Grid rows={$localTimeCells.length} cols={$dateIds.length}>
			{#each Object.entries($timeCellsByDate) as [dateId, dateTimeCells]}
				{#each dateTimeCells as timeCell}
					<TimePickerGridItem
						{dateId}
						{timeCell}
						selected={isIdSelected(
							dateTimeComposeId([dateId, timeToId(timeCell.time)]),
						)}
						current={isIdCurrent(
							dateTimeComposeId([dateId, timeToId(timeCell.time)]),
						)}
						disabled={isIdDisabled(
							dateTimeComposeId([dateId, timeToId(timeCell.time)]),
						)}
						{selectMode}
						neighbours={{
							top: false,
							bottom: false,
							left: false,
							right: false,
						}}
					/>
					{#if timeCell.isEndOfBlock}
						<GridItem
							x={$dateIdToColumnNumber[dateId]}
							y={$timeIdToRowNumber[timeToId(timeCell.time)] + 1}
						>
							padding
						</GridItem>
					{/if}
				{/each}
			{/each}
		</Grid>
	</SelectionProvider>
</div>

<style lang="postcss">
	.time-picker {
		@apply rounded-xl;
	}
</style>
