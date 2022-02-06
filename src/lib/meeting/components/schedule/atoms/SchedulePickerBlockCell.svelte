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
	} from '$lib/input/timePicker/utils/timePickerContext';
	import type { TimeCell } from '$lib/input/timePicker/types/TimeCell';

	export let dateId: string;
	export let timeCell: TimeCell;
	$: timeId = timeToId(timeCell.time);
	$: label =
		`${timeCell.time.format('HH:mm')}` +
		` ${dateFromId(dateId).format('D MMM YYYY')}`;
	$: dateTimeId = dateTimeComposeId([dateId, timeId]);

	export let editing = false;
	export let isIdSelected: (id: string) => boolean;
	export let isIdCurrent: (id: string) => boolean;
	export let isIdDisabled: (id: string) => boolean;

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

<div
	role="gridcell"
	aria-label={label}
	class="timepicker-cell"
	style:grid-area={gridArea({
		x: $dateIdToColumnNumber[dateId],
		y: $timeIdToRowNumber[timeId],
	})}
>
	<button
		bind:this={buttonElement}
		type="button"
		data-select-id={dateTimeComposeId([dateId, timeId])}
		aria-selected={cellSelected}
		disabled={!editing || cellDisabled}
		tabindex={cellCurrent ? 0 : -1}
		class:editing
		class:border-b-2={timeCell.time.add($resolution, 'minutes').minute() ===
			0 && !timeCell.isEndOfInterval}
		class:rounded-t-xl={timeCell.isStartOfInterval}
		class:rounded-b-xl={timeCell.isEndOfInterval}
	/>
</div>

<style lang="postcss">
	.timepicker-cell {
		@apply wh-full min-w-24 select-none min-h-6;

		& > button {
			@apply wh-full focus:outline-none;
			@apply bg-shade-100 border-gray-200 gdark:border-neutral-500;

			&:hover:not(:disabled) {
				@apply bg-shade-200;
			}

			transition: width 300ms var(--cubicOut), margin-left 300ms var(--cubicOut);
			&.editing {
				width: calc(100% - var(--scheduleWidth));
				margin-left: var(--scheduleWidth);
			}
		}
	}
</style>
