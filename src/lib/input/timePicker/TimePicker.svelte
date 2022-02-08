<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { Set } from 'immutable';
	import { nanoid } from 'nanoid';
	import { gridArea, gridTemplate } from '$lib/core/components/grid';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import {
		dateTimeFromId,
		dateTimeToId,
	} from '$lib/core/utils/dayjs/dateTimeIds';
	import { bound } from '$lib/core/utils/bound';
	import {
		getIntervalDiscretes,
		getLocalIntervals,
		intersectIntervals,
		subtractIntervals,
		unionIntervals,
	} from '$lib/core/utils/intervals';
	import { scrollOffset } from '$lib/core/utils/useScrollOffset';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { KeyboardHelp, SelectionProvider } from '$lib/input';
	import type { SelectionProviderEvent } from '$lib/input';
	import {
		setCurrentDateTimeElement,
		setTimePickerControls,
		setTimePickerState,
		setScrollElement,
	} from './utils/timePickerContext';
	import { createTimePickerState } from './utils/createTimePickerState';
	import { getTimePickerInterpolate } from './utils/getTimePickerInterpolate';
	import { getIntervalsBetween } from './utils/getIntervalsBetween';
	import { getTimePickerKeyboardReducer } from './utils/getTimePickerKeyboardReducer';
	import TimePickerFocusCell from './atoms/TimePickerFocusCell.svelte';
	import TimePickerLayoutHeader from './atoms/TimePickerLayoutHeader.svelte';
	import TimePickerLayoutIndex from './atoms/TimePickerLayoutIndex.svelte';
	import TimePickerBlockGap from './atoms/TimePickerBlockGap.svelte';
	import TimePickerBlockCell from './atoms/TimePickerBlockCell.svelte';
	import TimePickerBlockOverlay from './atoms/TimePickerBlockOverlay.svelte';
	import TimePickerSelectedInterval from './atoms/TimePickerSelectedInterval.svelte';
	import TimePickerActiveInterval from './atoms/TimePickerActiveInterval.svelte';

	export let id: string = nanoid(8);
	$: errorId = `${id}-error`;

	export let error = '';

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

	$: validIds = Set(
		$validIntervals
			.flatMap((interval) => getIntervalDiscretes(interval, $resolution))
			.map(dateTimeToId),
	);

	/**
	 * SelectionProvider currentId binding.
	 */
	const currentId = bound(currentDateTime, dateTimeToId, dateTimeFromId);

	let selectedIntervals: Interval[] = [];
	export { selectedIntervals as value };
	$: selectedIds = Set(
		selectedIntervals
			.flatMap((interval) => getIntervalDiscretes(interval, $resolution))
			.map(dateTimeToId),
	);

	export let disabled = false;

	setTimePickerState(state);
	const { flattenedTimeCells, dateIds, timeCellsByDateId, intervalsByDateId } =
		state;

	$: dates = $dateIds.map(dateFromId);

	const currentDateTimeElement = writable<Maybe<HTMLButtonElement>>();
	setCurrentDateTimeElement(currentDateTimeElement);

	const handleFocusUpdate = async () => {
		await tick();
		$currentDateTimeElement?.focus();
	};

	let activeIntervals: Interval[] = [];
	const handleSelectStart = (
		event: CustomEvent<SelectionProviderEvent['selectstart']>,
	) => {
		const { id } = event.detail;
		const start = dateTimeFromId(id);
		activeIntervals = [{ start, end: start.add($resolution, 'minutes') }];
	};

	const handleSelectThrough = (
		event: CustomEvent<SelectionProviderEvent['selectthrough']>,
	) => {
		const { id, startingId } = event.detail;
		if (startingId === undefined) {
			return;
		}
		activeIntervals = getLocalIntervals(
			intersectIntervals(
				$validIntervals,
				getIntervalsBetween({
					fromId: startingId,
					toId: id,
					dateIds: $dateIds,
					resolution: $resolution,
				}),
			),
		);
	};

	const handleSelectEnd = (
		event: CustomEvent<SelectionProviderEvent['selectthrough']>,
	) => {
		const { selectMode } = event.detail;
		if (selectMode === 'add') {
			selectedIntervals = getLocalIntervals(
				unionIntervals([...selectedIntervals, ...activeIntervals]),
			);
		} else {
			selectedIntervals = subtractIntervals(selectedIntervals, activeIntervals);
		}
		activeIntervals = [];
	};

	$: timePickerInterpolate = getTimePickerInterpolate(
		dates,
		validIds,
		$resolution,
	);

	$: timePickerKeyboardReducer = getTimePickerKeyboardReducer(dates, validIds);

	const scrollGridOffset = writable({ x: 0, y: 0 });
	const scrollElement = writable<Maybe<HTMLElement>>();
	setScrollElement(scrollElement);
</script>

<div {id} tabindex={0} aria-label="time picker" class="timepicker">
	<div class="timepicker-clip-content">
		<div
			bind:this={$scrollElement}
			class="timepicker-scroll-grid"
			use:scrollOffset={scrollGridOffset}
		>
			<KeyboardHelp />
			<TimePickerLayoutHeader shadow={$scrollGridOffset.y > 0} />
			<TimePickerLayoutIndex shadow={$scrollGridOffset.x > 0} />
			<SelectionProvider
				{selectedIds}
				{disabled}
				lazy
				bind:currentId={$currentId}
				interpolate={timePickerInterpolate}
				keyboardReducer={timePickerKeyboardReducer}
				on:focusupdate={handleFocusUpdate}
				on:selectstart={handleSelectStart}
				on:selectthrough={handleSelectThrough}
				on:selectend={handleSelectEnd}
				let:isIdSelected
				let:isIdCurrent
				let:isIdDisabled
				let:selectMode
			>
				<div
					role="grid"
					aria-describedby={errorId}
					class="timepicker-grid"
					style:display="grid"
					style:grid-template={gridTemplate({
						rows: $flattenedTimeCells.length,
						cols: $dateIds.length,
					})}
					style:grid-area={gridArea({ x: 1, y: 1 })}
				>
					<slot
						{disabled}
						{isIdSelected}
						{isIdCurrent}
						{isIdDisabled}
						{selectMode}
					/>
					{#each Object.entries($timeCellsByDateId) as [dateId, dateTimeCells]}
						{#each dateTimeCells as timeCell (timeCell.time.unix())}
							<slot name="time-cell" {dateId} {timeCell}>
								<TimePickerBlockCell
									{dateId}
									{timeCell}
									{disabled}
									{isIdSelected}
									{isIdCurrent}
									{isIdDisabled}
									{selectMode}
								/>
							</slot>
							{#if timeCell.isEndOfBlock && !timeCell.isEndOfDate}
								<TimePickerBlockGap {timeCell} />
							{/if}
						{/each}
					{/each}
					{#if !disabled}
						{#each Object.entries($intervalsByDateId) as [_, blocks] (blocks[0]?.start?.unix())}
							{#each blocks as block (block.start.unix())}
								<slot name="block-overlay" {block}>
									<TimePickerBlockOverlay {block} />
								</slot>
							{/each}
						{/each}
					{/if}
					{#each selectedIntervals as interval}
						<slot name="selected-interval" {interval}>
							<TimePickerSelectedInterval {interval} {selectMode} />
						</slot>
					{/each}
					{#each activeIntervals as interval}
						<slot name="active-interval" {interval}>
							<TimePickerActiveInterval {interval} {selectMode} />
						</slot>
					{/each}
					{#if !disabled}
						<slot name="focus-cell">
							<TimePickerFocusCell {selectMode} />
						</slot>
					{/if}
				</div>
			</SelectionProvider>
		</div>
	</div>
	{#if error !== ''}
		<div class="error-message-box">
			<span class="error-message">{error}</span>
		</div>
	{/if}
</div>

<style lang="postcss">
	.timepicker {
		@apply relative focus:outline-none wh-full z-0;
	}

	.timepicker-clip-content {
		@apply relative h-full min-h-0 overflow-hidden;
	}

	.timepicker-scroll-grid {
		@apply relative grid h-full overflow-auto;
		grid-template: min-content auto / min-content auto;
	}

	.timepicker-grid {
		@apply gap-x-3 p-1;
	}

	.error-message-box {
		@apply absolute inset-0 top-auto;
		@apply flex justify-center;
		@apply z-50 pointer-events-none;
	}

	.error-message {
		@apply text-sm italic text-red-400 text-center;
		@apply card !rounded-lg p-2;
	}
</style>
