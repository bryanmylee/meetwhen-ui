<script lang="ts">
	import { gridItemStyle } from '$lib/core/components/grid';
	import { dateToId } from '$lib/core/utils/dayjs/dateIds';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';

	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';

	const { currentDateTime } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();
</script>

<div
	class="timepicker-focus"
	style={gridItemStyle({
		x: $dateIdToColumnNumber[dateToId($currentDateTime)],
		y: $timeIdToRowNumber[timeToId($currentDateTime)],
	})}
/>

<style lang="postcss">
	.timepicker-focus {
		@apply rounded-xl pointer-events-none;
		:global(:focus-within) > & {
			@apply ring ring-inset ring-primary-400;
		}
	}
</style>
