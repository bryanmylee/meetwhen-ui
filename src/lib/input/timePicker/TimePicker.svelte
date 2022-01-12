<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { Set } from 'immutable';
	import { gridStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import {
		dateTimeFromId,
		dateTimeToId,
		dateTimeComposeId,
	} from '$lib/core/utils/dayjs/dateTimeIds';
	import { bound } from '$lib/core/utils/bound';
	import {
		getIntervalDiscretes,
		getLocalIntervalsFromDiscretes,
	} from '$lib/core/utils/intervals';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { SelectionProvider } from '$lib/input';
	import {
		setCurrentDateTimeElement,
		setTimePickerControls,
		setTimePickerState,
	} from './utils/timePickerContext';
	import TimePickerBlockCell from './atoms/TimePickerBlockCell.svelte';
	import { createTimePickerState } from './utils/createTimePickerState';
	import { getTimePickerInterpolate } from './utils/getTimePickerInterpolate';
	import TimePickerFocusCell from './atoms/TimePickerFocusCell.svelte';
	import TimePickerActiveInterval from './atoms/TimePickerActiveInterval.svelte';
	import TimePickerSelectedInterval from './atoms/TimePickerSelectedInterval.svelte';
	import TimePickerBlockGap from './atoms/TimePickerBlockGap.svelte';
	import { getTimePickerKeyboardReducer } from './utils/getTimePickerKeyboardReducer';
	import TimePickerBlockOverlay from './atoms/TimePickerBlockOverlay.svelte';

	let initValidIntervals: Interval[] = [];
	export { initValidIntervals as validIntervals };
	let initResolution = 30;
	export { initResolution as resolution };

	const [controls, state] = createTimePickerState({
		initValidIntervals,
		initResolution,
	});

	setTimePickerControls(controls);
	const { validIntervals, resolution, currentDateTime } = controls;
	$: $validIntervals = initValidIntervals;
	$: $resolution = initResolution;

	$: validIds = $validIntervals
		.flatMap((interval) => getIntervalDiscretes(interval, $resolution))
		.map(dateTimeToId);
	$: validIdSet = Set(validIds);

	/**
	 * SelectionProvider currentId binding.
	 */
	const currentId = bound(currentDateTime, dateTimeToId, dateTimeFromId);

	/**
	 * SelectionProvider selectedIds binding.
	 */
	let selectedIds: string[] = [];
	let selectedIntervals: Interval[] = [];
	$: tick().then(() => {
		selectedIntervals = getLocalIntervalsFromDiscretes(
			selectedIds.map(dateTimeFromId),
			$resolution,
		);
	});

	setTimePickerState(state);
	const { localTimeCells, dateIds, timeCellsByDateId, blocksByDateId } = state;

	$: dates = $dateIds.map(dateFromId);

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
	$: activeIntervals = getLocalIntervalsFromDiscretes(
		activeIds.map(dateTimeFromId),
		$resolution,
	);

	$: timePickerInterpolate = getTimePickerInterpolate(
		dates,
		validIdSet,
		$resolution,
	);

	$: timePickerKeyboardReducer = getTimePickerKeyboardReducer(
		dates,
		validIdSet,
	);
</script>

<div class="timepicker">
	<SelectionProvider
		bind:selectedIds
		bind:currentId={$currentId}
		bind:activeIds
		interpolate={timePickerInterpolate}
		keyboardReducer={timePickerKeyboardReducer}
		on:focusupdate={handleFocusUpdate}
		let:isIdSelected
		let:isIdCurrent
		let:isIdDisabled
		let:selectMode
	>
		<div
			class="timepicker-grid"
			style={gridStyle({ rows: $localTimeCells.length, cols: $dateIds.length })}
		>
			{#each Object.entries($timeCellsByDateId) as [dateId, dateTimeCells]}
				{#each dateTimeCells as timeCell}
					<!-- memoize computation of id -->
					{#each [dateTimeComposeId([dateId, timeToId(timeCell.time)])] as id}
						<TimePickerBlockCell
							{dateId}
							{timeCell}
							selected={isIdSelected(id)}
							current={isIdCurrent(id)}
							disabled={isIdDisabled(id)}
							{selectMode}
						/>
					{/each}
					{#if timeCell.isEndOfBlock}
						<TimePickerBlockGap {dateId} {timeCell} />
					{/if}
				{/each}
			{/each}
			{#each Object.entries($blocksByDateId) as [_, blocks]}
				{#each blocks as block}
					<TimePickerBlockOverlay {block} />
				{/each}
			{/each}
			{#each selectedIntervals as interval}
				<TimePickerSelectedInterval {interval} {selectMode} />
			{/each}
			{#each activeIntervals as interval}
				<TimePickerActiveInterval {interval} {selectMode} />
			{/each}
			<TimePickerFocusCell {selectMode} />
		</div>
	</SelectionProvider>
</div>

<style lang="postcss">
	.timepicker {
		@apply rounded-xl focus:outline-none;
	}

	.timepicker-grid {
		@apply gap-x-2;
	}
</style>
