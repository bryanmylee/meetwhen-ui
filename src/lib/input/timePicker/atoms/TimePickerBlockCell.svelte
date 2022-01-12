<script lang="ts">
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { gridItemStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import { dateTimeComposeId } from '$lib/core/utils/dayjs/dateTimeIds';
	import {
		getTimePickerState,
		getTimePickerControls,
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

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();

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
	class="timepicker-cell"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style={gridItemStyle({
		x: $dateIdToColumnNumber[dateId],
		y: $timeIdToRowNumber[timeId],
	})}
	class:border-b-2={timeCell.time.add($resolution, 'minutes').minute() === 0 &&
		!timeCell.isEndOfBlock}
	class:rounded-t-xl={timeCell.isStartOfBlock}
	class:rounded-b-xl={timeCell.isEndOfBlock}
/>

<style lang="postcss">
	.timepicker-cell {
		@apply wh-full select-none focus:outline-none min-h-6;
		@apply bg-shade-100 border-gray-200 gdark:border-neutral-500;
		@apply transition;

		&:hover:not(:disabled) {
			@apply bg-shade-200;
		}
	}
</style>
