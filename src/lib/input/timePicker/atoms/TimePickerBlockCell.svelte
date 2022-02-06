<script lang="ts">
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { gridArea } from '$lib/core/components/grid';
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
	$: dateTimeId = dateTimeComposeId([dateId, timeId]);

	export let disabled = false;
	export let isIdSelected: (id: string) => boolean;
	export let isIdCurrent: (id: string) => boolean;
	export let isIdDisabled: (id: string) => boolean;
	export let selectMode: Maybe<SelectMode> = undefined;

	$: cellSelected = isIdSelected(dateTimeId);
	$: cellCurrent = isIdCurrent(dateTimeId);
	$: cellDisabled = isIdDisabled(dateTimeId);

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();

	let buttonElement: Maybe<HTMLButtonElement>;
	const currentDateTimeElement = getCurrentDateTimeElement();
	$: if (cellCurrent) {
		$currentDateTimeElement = buttonElement;
	}
</script>

<button
	bind:this={buttonElement}
	type="button"
	role="gridcell"
	aria-label={label}
	data-select-id={dateTimeComposeId([dateId, timeId])}
	aria-selected={cellSelected}
	disabled={disabled || cellDisabled}
	tabindex={cellCurrent ? 0 : -1}
	class="timepicker-cell"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	class:border-b-2={timeCell.time.add($resolution, 'minutes').minute() === 0 &&
		!timeCell.isEndOfInterval}
	class:rounded-t-xl={timeCell.isStartOfInterval}
	class:rounded-b-xl={timeCell.isEndOfInterval}
	style:grid-area={gridArea({
		x: $dateIdToColumnNumber[dateId],
		y: $timeIdToRowNumber[timeId],
	})}
/>

<style lang="postcss">
	.timepicker-cell {
		@apply wh-full min-w-24 select-none focus:outline-none min-h-6;
		@apply bg-shade-100 border-gray-200 gdark:border-neutral-500;
		@apply transition;

		&:hover:not(:disabled) {
			@apply bg-shade-200;
		}
	}
</style>
