<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { Set } from 'immutable';
	import { gridStyle, gridItemStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import {
		dateTimeFromId,
		dateTimeToId,
		dateTimeComposeId,
	} from '$lib/core/utils/dayjs/dateTimeIds';
	import { bound } from '$lib/core/utils/bound';
	import { getIntervalsFromDiscretes } from '$lib/core/utils/intervals';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { SelectionProvider } from '$lib/input';
	import {
		setCurrentDateTimeElement,
		setTimePickerState,
	} from './utils/timePickerContext';
	import TimePickerGridItem from './atoms/TimePickerGridItem.svelte';
	import { createTimePickerState } from './utils/createTimePickerState';
	import { timePickerIntervalStyle } from './atoms/timePickerIntervalStyle';

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
	$: selectedIdSet = Set(selectedIds);

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

	/**
	 * SelectionProvider activeIds binding.
	 */
	let activeIds: string[] = [];
	$: activeIntervals = getIntervalsFromDiscretes(
		activeIds.map(dateTimeFromId),
		$_resolution,
	);
	$: console.log(activeIntervals);
</script>

<div tabindex={0} class="timepicker focus">
	<SelectionProvider
		bind:selectedIds
		bind:currentId={$currentId}
		bind:activeIds
		on:focusupdate={handleFocusUpdate}
		let:isIdSelected
		let:isIdCurrent
		let:isIdDisabled
		let:selectMode
	>
		<div
			style={gridStyle({ rows: $localTimeCells.length, cols: $dateIds.length })}
		>
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
					/>
					{#if timeCell.isEndOfBlock}
						<div
							style={gridItemStyle({
								x: $dateIdToColumnNumber[dateId],
								y: $timeIdToRowNumber[timeToId(timeCell.time)] + 1,
							})}
						>
							padding
						</div>
					{/if}
				{/each}
			{/each}
			{#each activeIntervals as interval}
				<div
					class="timepicker-active"
					class:add={selectMode === 'add'}
					class:remove={selectMode === 'remove'}
					style={timePickerIntervalStyle({
						dateIdToColumnNumber: $dateIdToColumnNumber,
						timeIdToRowNumber: $timeIdToRowNumber,
						resolution: $_resolution,
						interval,
					})}
				/>
			{/each}
		</div>
	</SelectionProvider>
</div>

<style lang="postcss">
	.timepicker {
		@apply rounded-xl;
	}

	.timepicker-active {
		@apply rounded-xl pointer-events-none z-20;
		@apply ring ring-inset;
		&.add {
			@apply bg-primary-300 ring-primary-500 gdark:ring-white;
		}
		&.remove {
			@apply ring-red-400;
		}
	}
</style>
