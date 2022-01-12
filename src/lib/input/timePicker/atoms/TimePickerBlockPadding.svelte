<script lang="ts">
	import { gridItemStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import type { TimeCell } from '../types/TimeCell';
	import { getTimePickerState } from '../utils/timePickerContext';

	export let dateId: string;
	export let timeCell: TimeCell;

	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();
</script>

<div
	class="timepicker-padding"
	style={gridItemStyle({
		x: $dateIdToColumnNumber[dateId],
		y: $timeIdToRowNumber[timeToId(timeCell.time)] + 1,
	})}
/>

<style lang="postcss">
	.timepicker-padding {
		@apply min-h-4;
	}
</style>
