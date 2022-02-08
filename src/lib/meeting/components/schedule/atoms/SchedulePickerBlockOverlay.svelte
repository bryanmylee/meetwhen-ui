<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import { intervalGridArea } from '$lib/input/timePicker/utils/intervalGridArea';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '$lib/input/timePicker/utils/timePickerContext';

	export let block: Interval;

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();
</script>

<div
	class="timepicker-block"
	style:grid-area={intervalGridArea({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval: block,
	})}
>
	<div class="timepicker-schedule-border" />
</div>

<style lang="postcss">
	.timepicker-block {
		@apply rounded-xl pointer-events-none z-[-1];

		& .timepicker-schedule-border {
			width: calc(var(--scheduleWidth) - 2px);
			@apply h-full rounded-l-xl bg-shade-100;
			@apply pointer-events-none;
		}
	}
</style>
