<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { Set } from 'immutable';
	import { nanoid } from 'nanoid';
	import { gridItemStyle, gridStyle } from '$lib/core/components/grid';
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
	} from './utils/timePickerContext';
	import { createTimePickerState } from './utils/createTimePickerState';
	import { getTimePickerInterpolate } from './utils/getTimePickerInterpolate';
	import { getIntervalsBetween } from './utils/getIntervalsBetween';
	import { getTimePickerKeyboardReducer } from './utils/getTimePickerKeyboardReducer';
	import TimePickerFocusCell from './atoms/TimePickerFocusCell.svelte';
	import TimePickerActiveInterval from './atoms/TimePickerActiveInterval.svelte';
	import TimePickerSelectedInterval from './atoms/TimePickerSelectedInterval.svelte';
	import TimePickerBlockOverlay from './atoms/TimePickerBlockOverlay.svelte';
	import TimePickerLayoutHeader from './atoms/TimePickerLayoutHeader.svelte';
	import TimePickerLayoutIndex from './atoms/TimePickerLayoutIndex.svelte';
	import TimePickerColumn from './atoms/TimePickerColumn.svelte';

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
</script>

<div {id} tabindex={0} aria-label="time picker" class="timepicker">
	<div class="timepicker-clip-content">
		<div class="timepicker-scroll-grid" use:scrollOffset={scrollGridOffset}>
			<KeyboardHelp />
			<TimePickerLayoutHeader shadow={$scrollGridOffset.y > 0} />
			<TimePickerLayoutIndex shadow={$scrollGridOffset.x > 0} />
			<SelectionProvider
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
					style={gridItemStyle({ x: 1, y: 1 }) +
						gridStyle({
							rows: $flattenedTimeCells.length,
							cols: $dateIds.length,
						})}
				>
					{#each Object.entries($timeCellsByDateId) as [dateId, dateTimeCells]}
						{#each dateTimeCells as timeCell}
							<TimePickerColumn
								{dateId}
								{timeCell}
								{isIdSelected}
								{isIdCurrent}
								{isIdDisabled}
								{selectMode}
							/>
						{/each}
					{/each}
					{#each Object.entries($intervalsByDateId) as [_, blocks]}
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
	</div>
	<span>{error}</span>
</div>

<style lang="postcss">
	.timepicker {
		@apply relative focus:outline-none wh-full;
	}

	.timepicker-clip-content {
		@apply relative h-full min-h-0 overflow-hidden;
	}

	.timepicker-scroll-grid {
		@apply relative grid h-full overflow-auto gap-5 pb-2;
		grid-template: min-content auto / min-content auto;
	}

	.timepicker-grid {
		@apply gap-x-3;
	}
</style>
