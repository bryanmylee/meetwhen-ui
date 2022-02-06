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
/>

<style lang="postcss">
	.timepicker-block {
		@apply ring-primary-400 rounded-xl;
		@apply pointer-events-none;
		margin-left: var(--scheduleWidth);

		:global(.timepicker:focus) & {
			@apply ring;
		}
	}
</style>
