<script lang="ts">
	import type { HasNeighbors } from '$lib/core/types/HasNeighbors';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { gridItemStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import { dateTimeComposeId } from '$lib/core/utils/dayjs/dateTimeIds';
	import {
		getTimePickerState,
		getCurrentDateTimeElement,
	} from '../utils/timePickerContext';
	import type { TimeCell } from '../types/TimeCell';

	export let dateId: string;
	export let timeCell: TimeCell;
	$: timeId = timeToId(timeCell.time);
	$: label =
		`${timeCell.time.format('HH:mm')}` +
		` ${dateFromId(dateId).format('D MMM YYYY')}`;

	export let selected = false;
	export let current = false;
	export let disabled = false;
	export let selectMode: Maybe<SelectMode> = undefined;
	export let neighbors: HasNeighbors;

	const state = getTimePickerState();
	const { dateIdToColumnNumber, timeIdToRowNumber } = state;

	let buttonElement: Maybe<HTMLButtonElement>;
	const currentDateTimeElement = getCurrentDateTimeElement();
	$: if (current) {
		$currentDateTimeElement = buttonElement;
	}
</script>

<button
	bind:this={buttonElement}
	type="button"
	role="gridcell"
	aria-label={label}
	data-select-id={dateTimeComposeId([dateId, timeId])}
	aria-selected={selected}
	{disabled}
	tabindex={current ? 0 : -1}
	class="datetime-item"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style={gridItemStyle({
		x: $dateIdToColumnNumber[dateId],
		y: $timeIdToRowNumber[timeId],
	})}
>
	<div
		class="bg"
		class:border-b-2={timeCell.time.minute() === 0 && !timeCell.isEndOfBlock}
		class:rounded-t-xl={timeCell.isStartOfBlock}
		class:rounded-b-xl={timeCell.isEndOfBlock}
	/>
	<div
		class="select"
		class:!rounded-t-none={neighbors.top}
		class:!rounded-b-none={neighbors.bottom}
		class:!rounded-l-none={neighbors.left}
		class:!rounded-r-none={neighbors.right}
	/>
</button>

<style lang="postcss">
	.datetime-item {
		@apply relative wh-full select-none focus:outline-none min-h-6;

		& > .bg {
			@apply wh-full select-none;
			@apply bg-shade-100 border-gray-200 gdark:border-neutral-500;
			@apply pointer-events-none transition;
		}

		& > .select {
			@apply absolute inset-0 select-none rounded-xl;
			@apply pointer-events-none transition;
		}

		:global(:focus-within) > &[tabindex='0'] {
			&[aria-selected='false'] > .select {
				@apply ring ring-inset ring-primary-400;
			}
			&[aria-selected='true'] > .select {
				@apply ring ring-inset ring-white;
			}
		}

		&:hover {
			& > .bg {
				@apply bg-shade-200;
			}
		}

		&[aria-selected='true'] {
			& > .select {
				@apply bg-primary-400 shadow shadow-primary-400/30 z-10;
			}
			&.add > .select {
				@apply shadow-lg shadow-primary-400/30;
			}
			&.remove > .select {
				@apply bg-primary-400/50;
			}
			&:hover > .select {
				@apply bg-primary-300;
			}
		}
	}
</style>
