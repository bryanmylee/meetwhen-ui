<script lang="ts">
	import { gridItemStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import type { TimeCell } from '../types/TimeCell';
	import { getTimePickerState } from '../utils/timePickerContext';

	export let timeCell: TimeCell;

	const { timeIdToRowNumber } = getTimePickerState();
</script>

<div
	class="timepicker-padding"
	style={gridItemStyle({
		y: $timeIdToRowNumber[timeToId(timeCell.time)] + 1,
	})}
/>

<style lang="postcss">
	.timepicker-padding {
		@apply h-4;
	}
</style>
